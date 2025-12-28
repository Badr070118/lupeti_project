import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PaytrInitiateDto } from './dto/paytr-initiate.dto';
import { PaytrCallbackDto } from './dto/paytr-callback.dto';
import { PaymentsQueryDto } from './dto/payments-query.dto';

const PAYTR_TOKEN_ENDPOINT = 'https://www.paytr.com/odeme/api/get-token';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async initiatePaytr(userId: string, dto: PaytrInitiateDto, clientIp: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
      include: {
        payment: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new ConflictException('Order is not awaiting payment');
    }

    let payment = await this.prisma.payment.findUnique({
      where: { orderId: order.id },
    });

    if (!payment) {
      payment = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          provider: PaymentProvider.PAYTR,
          status: PaymentStatus.INITIATED,
          amountCents: order.totalCents,
          currency: order.currency,
        },
      });
    } else if (payment.amountCents !== order.totalCents) {
      payment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { amountCents: order.totalCents, currency: order.currency },
      });
    }

    if (!payment.providerReference) {
      payment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { providerReference: payment.id },
      });
    }

    const paytrRequest = this.buildPaytrTokenRequest(
      order.user.email,
      clientIp,
      payment,
    );

    await this.prisma.paymentEvent.create({
      data: {
        paymentId: payment.id,
        type: 'PAYTR_INITIATE_REQUEST',
        payload: paytrRequest.sanitizedPayload,
      },
    });

    const response = await this.requestPaytrToken(paytrRequest.payload);

    if (response.status !== 'success') {
      await this.prisma.paymentEvent.create({
        data: {
          paymentId: payment.id,
          type: 'PAYTR_INITIATE_FAILED',
          payload: response,
        },
      });
      throw new ConflictException(
        response.reason ?? 'Unable to initiate payment with PayTR',
      );
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.PENDING },
    });

    await this.prisma.paymentEvent.create({
      data: {
        paymentId: payment.id,
        type: 'PAYTR_INITIATE_SUCCESS',
        payload: response,
      },
    });

    return {
      token: response.token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${response.token}`,
      merchantOid: payment.providerReference,
      merchantId: this.requireConfig('PAYTR_MERCHANT_ID'),
      amountCents: payment.amountCents,
      currency: payment.currency,
    };
  }

  async handlePaytrCallback(payload: PaytrCallbackDto) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerReference: payload.merchant_oid },
      include: {
        order: true,
      },
    });

    if (!payment) {
      this.logger.warn(
        `Callback for unknown merchant_oid ${payload.merchant_oid}`,
      );
      throw new NotFoundException('Payment not found');
    }

    const expectedHash = this.computePaytrHash(
      payload.merchant_oid,
      payload.status,
      payload.total_amount,
    );

    if (expectedHash !== payload.hash) {
      this.logger.warn(
        `Invalid PayTR signature for payment ${payment.id}: expected ${expectedHash}, received ${payload.hash}`,
      );
      await this.recordEvent(
        payment.id,
        'PAYTR_CALLBACK_INVALID_SIGNATURE',
        payload,
      );
      throw new ForbiddenException('Invalid signature');
    }

    const amountMatches =
      Number(payload.total_amount) === Number(payment.amountCents);

    if (!amountMatches) {
      await this.recordEvent(
        payment.id,
        'PAYTR_CALLBACK_AMOUNT_MISMATCH',
        payload,
      );
      throw new ConflictException('Amount mismatch');
    }

    const isSuccess = payload.status.toLowerCase() === 'success';
    const nextPaymentStatus = isSuccess
      ? PaymentStatus.PAID
      : PaymentStatus.FAILED;
    const nextOrderStatus = isSuccess ? OrderStatus.PAID : OrderStatus.FAILED;

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: nextPaymentStatus },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: nextOrderStatus },
      });
      await tx.paymentEvent.create({
        data: {
          paymentId: payment.id,
          type: isSuccess ? 'PAYTR_CALLBACK_SUCCESS' : 'PAYTR_CALLBACK_FAILURE',
          payload: payload as unknown as Prisma.InputJsonValue,
        },
      });
    });

    return 'OK';
  }

  async listPayments(query: PaymentsQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
    const skip = (page - 1) * limit;
    const where: Prisma.PaymentWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.provider) where.provider = query.provider;

    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              userId: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  private async recordEvent(paymentId: string, type: string, payload: unknown) {
    await this.prisma.paymentEvent.create({
      data: {
        paymentId,
        type,
        payload: payload as Prisma.InputJsonValue,
      },
    });
  }

  private buildPaytrTokenRequest(
    email: string,
    rawIp: string,
    payment: {
      id: string;
      providerReference: string | null;
      amountCents: number;
      currency: string;
    },
  ) {
    const merchantId = this.requireConfig('PAYTR_MERCHANT_ID');
    const merchantKey = this.requireConfig('PAYTR_MERCHANT_KEY');
    const merchantSalt = this.requireConfig('PAYTR_MERCHANT_SALT');
    const okUrl = this.requireConfig('PAYTR_OK_URL');
    const failUrl = this.requireConfig('PAYTR_FAIL_URL');
    const callbackUrl = this.requireConfig('PAYTR_CALLBACK_URL');

    const userIp = rawIp || '127.0.0.1';
    const merchantOid = payment.providerReference ?? payment.id;
    const paymentAmount = payment.amountCents;
    const currency = (payment.currency ?? 'TRY').toUpperCase();

    const hashStr = [
      merchantId,
      userIp,
      merchantOid,
      email,
      paymentAmount,
      currency,
      merchantSalt,
    ].join('');

    const paytrToken = createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');

    const params = new URLSearchParams({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email,
      payment_amount: paymentAmount.toString(),
      currency,
      merchant_ok_url: okUrl,
      merchant_fail_url: failUrl,
      merchant_callback_url: callbackUrl,
      paytr_token: paytrToken,
      test_mode: this.isTestMode() ? '1' : '0',
      timeout_limit: '30',
      no_installment: '1',
      max_installment: '0',
    });

    const sanitizedPayload = {
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      payment_amount: paymentAmount,
      currency,
      test_mode: this.isTestMode() ? 1 : 0,
    };

    return { payload: params, sanitizedPayload };
  }

  private async requestPaytrToken(params: URLSearchParams) {
    const response = await fetch(PAYTR_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(`PayTR token API failed: ${text}`);
      throw new ConflictException('Failed to communicate with PayTR');
    }

    return (await response.json()) as {
      status: string;
      token?: string;
      reason?: string;
    };
  }

  private computePaytrHash(
    merchantOid: string,
    status: string,
    totalAmount: string,
  ) {
    const merchantKey = this.requireConfig('PAYTR_MERCHANT_KEY');
    const merchantSalt = this.requireConfig('PAYTR_MERCHANT_SALT');
    const hashStr = `${merchantOid}${merchantSalt}${status}${totalAmount}`;
    return createHmac('sha256', merchantKey).update(hashStr).digest('base64');
  }

  private requireConfig(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) {
      throw new Error(`Missing configuration for ${key}`);
    }
    return value;
  }

  private isTestMode() {
    return this.config.get('NODE_ENV') !== 'production';
  }
}
