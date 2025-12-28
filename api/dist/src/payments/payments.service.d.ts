import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaytrInitiateDto } from './dto/paytr-initiate.dto';
import { PaytrCallbackDto } from './dto/paytr-callback.dto';
import { PaymentsQueryDto } from './dto/payments-query.dto';
export declare class PaymentsService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    initiatePaytr(userId: string, dto: PaytrInitiateDto, clientIp: string): Promise<{
        token: string | undefined;
        iframeUrl: string;
        merchantOid: string | null;
        merchantId: string;
        amountCents: number;
        currency: string;
    }>;
    handlePaytrCallback(payload: PaytrCallbackDto): Promise<string>;
    listPayments(query: PaymentsQueryDto): Promise<{
        data: ({
            order: {
                id: string;
                userId: string;
                status: import(".prisma/client").$Enums.OrderStatus;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amountCents: number;
            providerReference: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    private recordEvent;
    private buildPaytrTokenRequest;
    private requestPaytrToken;
    private computePaytrHash;
    private requireConfig;
    private isTestMode;
}
