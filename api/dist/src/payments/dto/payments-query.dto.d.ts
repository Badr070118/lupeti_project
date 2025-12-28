import { PaymentProvider, PaymentStatus } from '@prisma/client';
export declare class PaymentsQueryDto {
    page?: number;
    limit?: number;
    status?: PaymentStatus;
    provider?: PaymentProvider;
}
