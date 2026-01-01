import type { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaytrInitiateDto } from './dto/paytr-initiate.dto';
import { PaytrCallbackDto } from './dto/paytr-callback.dto';
import { PaymentsQueryDto } from './dto/payments-query.dto';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    private getUserId;
    private getClientIp;
    initiatePaytr(req: Request & {
        user?: JwtPayload;
    }, dto: PaytrInitiateDto): Promise<{
        token: string | undefined;
        iframeUrl: string;
        merchantOid: string | null;
        merchantId: string;
        amountCents: number;
        currency: string;
    }>;
    paytrCallback(payload: PaytrCallbackDto): Promise<string>;
    listPayments(query: PaymentsQueryDto): Promise<{
        data: ({
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                userId: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
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
}
