import { OrderStatus } from '@prisma/client';
export declare class OrdersQueryDto {
    page?: number;
    limit?: number;
    status?: OrderStatus;
}
