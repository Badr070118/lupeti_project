import { TicketCategory, TicketStatus } from '@prisma/client';
export declare class SupportQueryDto {
    page?: number;
    limit?: number;
    status?: TicketStatus;
    category?: TicketCategory;
    search?: string;
}
