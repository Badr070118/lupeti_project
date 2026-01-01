import { TicketCategory } from '@prisma/client';
export declare class CreateSupportTicketDto {
    email?: string;
    subject: string;
    message: string;
    category?: TicketCategory;
}
