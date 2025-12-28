"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const PAYTR_TOKEN_ENDPOINT = 'https://www.paytr.com/odeme/api/get-token';
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    config;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async initiatePaytr(userId, dto, clientIp) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== client_1.OrderStatus.PENDING_PAYMENT) {
            throw new common_1.ConflictException('Order is not awaiting payment');
        }
        let payment = await this.prisma.payment.findUnique({
            where: { orderId: order.id },
        });
        if (!payment) {
            payment = await this.prisma.payment.create({
                data: {
                    orderId: order.id,
                    provider: client_1.PaymentProvider.PAYTR,
                    status: client_1.PaymentStatus.INITIATED,
                    amountCents: order.totalCents,
                    currency: order.currency,
                },
            });
        }
        else if (payment.amountCents !== order.totalCents) {
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
        const paytrRequest = this.buildPaytrTokenRequest(order.user.email, clientIp, payment);
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
            throw new common_1.ConflictException(response.reason ?? 'Unable to initiate payment with PayTR');
        }
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: client_1.PaymentStatus.PENDING },
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
    async handlePaytrCallback(payload) {
        const payment = await this.prisma.payment.findFirst({
            where: { providerReference: payload.merchant_oid },
            include: {
                order: true,
            },
        });
        if (!payment) {
            this.logger.warn(`Callback for unknown merchant_oid ${payload.merchant_oid}`);
            throw new common_1.NotFoundException('Payment not found');
        }
        const expectedHash = this.computePaytrHash(payload.merchant_oid, payload.status, payload.total_amount);
        if (expectedHash !== payload.hash) {
            this.logger.warn(`Invalid PayTR signature for payment ${payment.id}: expected ${expectedHash}, received ${payload.hash}`);
            await this.recordEvent(payment.id, 'PAYTR_CALLBACK_INVALID_SIGNATURE', payload);
            throw new common_1.ForbiddenException('Invalid signature');
        }
        const amountMatches = Number(payload.total_amount) === Number(payment.amountCents);
        if (!amountMatches) {
            await this.recordEvent(payment.id, 'PAYTR_CALLBACK_AMOUNT_MISMATCH', payload);
            throw new common_1.ConflictException('Amount mismatch');
        }
        const isSuccess = payload.status.toLowerCase() === 'success';
        const nextPaymentStatus = isSuccess
            ? client_1.PaymentStatus.PAID
            : client_1.PaymentStatus.FAILED;
        const nextOrderStatus = isSuccess ? client_1.OrderStatus.PAID : client_1.OrderStatus.FAILED;
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
                    payload: payload,
                },
            });
        });
        return 'OK';
    }
    async listPayments(query) {
        const page = query.page ?? 1;
        const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.provider)
            where.provider = query.provider;
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
    async recordEvent(paymentId, type, payload) {
        await this.prisma.paymentEvent.create({
            data: {
                paymentId,
                type,
                payload: payload,
            },
        });
    }
    buildPaytrTokenRequest(email, rawIp, payment) {
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
        const paytrToken = (0, crypto_1.createHmac)('sha256', merchantKey)
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
    async requestPaytrToken(params) {
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
            throw new common_1.ConflictException('Failed to communicate with PayTR');
        }
        return (await response.json());
    }
    computePaytrHash(merchantOid, status, totalAmount) {
        const merchantKey = this.requireConfig('PAYTR_MERCHANT_KEY');
        const merchantSalt = this.requireConfig('PAYTR_MERCHANT_SALT');
        const hashStr = `${merchantOid}${merchantSalt}${status}${totalAmount}`;
        return (0, crypto_1.createHmac)('sha256', merchantKey).update(hashStr).digest('base64');
    }
    requireConfig(key) {
        const value = this.config.get(key);
        if (!value) {
            throw new Error(`Missing configuration for ${key}`);
        }
        return value;
    }
    isTestMode() {
        return this.config.get('NODE_ENV') !== 'production';
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map