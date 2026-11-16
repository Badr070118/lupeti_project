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
import { isIP } from 'net';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
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
    private readonly settingsService: SettingsService,
  ) {}

  async initiatePaytr(userId: string, dto: PaytrInitiateDto, clientIp: string) {
    const paytrEnabled = await this.settingsService.isPaytrEnabled();
    if (!paytrEnabled) {
      throw new ConflictException('PayTR payments are currently disabled');
    }
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
      include: {
        payment: true,
        items: true,
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

    if (payment && payment.provider !== PaymentProvider.PAYTR) {
      throw new ConflictException('Order payment method is not PayTR');
    }

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

    const normalizedMerchantOid = this.normalizePaytrMerchantOid(
      payment.providerReference ?? payment.id,
    );
    if (payment.providerReference !== normalizedMerchantOid) {
      payment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { providerReference: normalizedMerchantOid },
      });
    }

    const paytrRequest = this.buildPaytrTokenRequest(
      order.user.email,
      clientIp,
      payment,
      order,
    );

    this.logger.log(
      `PayTR initiate ${order.id} (${payment.amountCents} ${payment.currency}) test=${this.isTestMode()}`,
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

    await this.prisma.payment.updateMany({
      where: { id: payment.id, status: PaymentStatus.INITIATED },
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
    this.logger.log(
      `PayTR callback merchant_oid=${payload.merchant_oid} status=${payload.status}`,
    );
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

    const amountMatches = (payload.payment_amount !== undefined
      ? Number(payload.payment_amount) === payment.amountCents
      : payload.status === 'failed' || Number(payload.total_amount) === payment.amountCents) &&
      (payload.status !== 'success' || Number(payload.total_amount) >= payment.amountCents);

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
      await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ${payment.orderId}::uuid FOR UPDATE`;
      const current = await tx.order.findUnique({
        where: { id: payment.orderId },
        include: { payment: true, items: true },
      });
      if (!current || !current.payment) throw new NotFoundException('Order not found');
      if (current.payment.status === nextPaymentStatus) return;
      if (current.status !== OrderStatus.PENDING_PAYMENT ||
          (current.payment.status !== PaymentStatus.INITIATED && current.payment.status !== PaymentStatus.PENDING)) {
        throw new ConflictException('Payment or order is already finalized');
      }
      if (!isSuccess) {
        for (const item of [...current.items].sort((a, b) => a.productId.localeCompare(b.productId))) {
          await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
        }
      }
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
    order: {
      items: Array<{
        titleSnapshot: string;
        priceCentsSnapshot: number;
        quantity: number;
      }>;
      shippingAddress: Prisma.JsonValue;
    },
  ) {
    const merchantId = this.requireConfig('PAYTR_MERCHANT_ID');
    const merchantKey = this.requireConfig('PAYTR_MERCHANT_KEY');
    const merchantSalt = this.requireConfig('PAYTR_MERCHANT_SALT');
    const okUrl = this.requireConfig('PAYTR_OK_URL', 'PAYTR_MERCHANT_OK_URL');
    const failUrl = this.requireConfig('PAYTR_FAIL_URL', 'PAYTR_MERCHANT_FAIL_URL');
    const callbackUrl = this.requireConfig('PAYTR_CALLBACK_URL');

    const userIp = this.resolveCustomerIp(rawIp);
    const merchantOid = payment.providerReference ?? payment.id;
    const paymentAmount = payment.amountCents;
    const currency = payment.currency.toUpperCase() === 'TRY' ? 'TL' : payment.currency.toUpperCase();
    const testMode = this.isTestMode() ? '1' : '0';
    const noInstallment = '1';
    const maxInstallment = '0';

    const { userName, userAddress, userPhone } =
      this.buildPaytrCustomer(order.shippingAddress);
    const userBasket = this.buildPaytrBasket(order.items);

    const hashStr = [
      merchantId,
      userIp,
      merchantOid,
      email,
      paymentAmount,
      userBasket,
      noInstallment,
      maxInstallment,
      currency,
      testMode,
    ].join('');

    const paytrToken = createHmac('sha256', merchantKey)
      .update(hashStr + merchantSalt)
      .digest('base64');

    const params = new URLSearchParams({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email,
      user_name: userName,
      user_address: userAddress,
      user_phone: userPhone,
      user_basket: userBasket,
      payment_amount: paymentAmount.toString(),
      currency,
      merchant_ok_url: okUrl,
      merchant_fail_url: failUrl,
      merchant_callback_url: callbackUrl,
      paytr_token: paytrToken,
      test_mode: testMode,
      timeout_limit: '30',
      no_installment: noInstallment,
      max_installment: maxInstallment,
      debug_on: this.isTestMode() ? '1' : '0',
    });

    const sanitizedPayload = {
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      payment_amount: paymentAmount,
      currency,
      test_mode: Number(testMode),
      basket_items: order.items.length,
    };

    return { payload: params, sanitizedPayload };
  }

  private normalizePaytrMerchantOid(value: string) {
    const normalized = value.replace(/[^a-zA-Z0-9]/g, '');
    return normalized.length ? normalized : value;
  }

  private resolveCustomerIp(rawIp: string) {
    const normalize = (value: string) => value.trim().replace(/^::ffff:/i, '');
    const isPublic = (value: string) => {
      if (!isIP(value)) return false;
      if (value.includes(':')) return !/^(::1$|f[cd]|fe[89ab])/i.test(value);
      const [first, second] = value.split('.').map(Number);
      return first !== 0 && first !== 10 && first !== 127 && first < 224 &&
        !(first === 172 && second >= 16 && second <= 31) &&
        !(first === 192 && second === 168) && !(first === 169 && second === 254) &&
        !(first === 100 && second >= 64 && second <= 127);
    };
    const clientIp = normalize(rawIp);
    if (isPublic(clientIp)) return clientIp;
    const testIp = normalize(this.config.get<string>('PAYTR_TEST_PUBLIC_IP') ?? '');
    if (this.isTestMode() && isPublic(testIp)) return testIp;
    if (this.isTestMode()) return clientIp || '127.0.0.1';
    throw new ConflictException('A public client IP is required by PayTR. For local tests configure PAYTR_TEST_PUBLIC_IP.');
  }

  private async requestPaytrToken(params: URLSearchParams) {
    const response = await fetch(PAYTR_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const text = await response.text();

    if (!response.ok) {
      this.logger.error(`PayTR token API failed: ${text}`);
      throw new ConflictException('Failed to communicate with PayTR');
    }

    try {
      return JSON.parse(text) as {
        status: string;
        token?: string;
        reason?: string;
      };
    } catch (error) {
      this.logger.error(
        `PayTR token API returned non-JSON payload: ${text}`,
      );
      throw new ConflictException('Invalid PayTR response payload');
    }
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

  private requireConfig(key: string, fallbackKey?: string): string {
    const value =
      this.config.get<string>(key) ??
      (fallbackKey ? this.config.get<string>(fallbackKey) : undefined);
    if (!value) {
      const missing = fallbackKey ? `${key} or ${fallbackKey}` : key;
      throw new Error(`Missing configuration for ${missing}`);
    }
    return value;
  }

  private isTestMode() {
    const explicit = this.config.get<string>('PAYTR_TEST_MODE');
    if (explicit !== undefined) {
      return explicit === '1' || explicit.toLowerCase() === 'true';
    }
    return this.config.get('NODE_ENV') !== 'production';
  }

  private buildPaytrBasket(
    items: Array<{
      titleSnapshot: string;
      priceCentsSnapshot: number;
      quantity: number;
    }>,
  ) {
    const basket = items.map((item) => [
      item.titleSnapshot,
      (item.priceCentsSnapshot / 100).toFixed(2),
      item.quantity,
    ]);
    return Buffer.from(JSON.stringify(basket)).toString('base64');
  }

  private buildPaytrCustomer(addressJson: Prisma.JsonValue) {
    const address =
      typeof addressJson === 'object' && addressJson !== null
        ? (addressJson as Record<string, string | null | undefined>)
        : {};
    const userName = address.fullName ?? 'Customer';
    const userPhone = address.phone ?? '0000000000';
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);
    const userAddress = parts.length ? parts.join(', ') : 'N/A';
    return { userName, userPhone, userAddress };
  }
}
