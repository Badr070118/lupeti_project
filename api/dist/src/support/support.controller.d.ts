import type { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { SupportService } from './support.service';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(dto: CreateSupportTicketDto, req: Request & {
        user?: JwtPayload;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
        } | null;
        replies: {
            id: string;
            createdAt: Date;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
            author: {
                id: string;
                email: string;
                name: string | null;
            } | null;
        }[];
    } & {
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.TicketCategory;
        userId: string | null;
        subject: string;
        message: string;
        assignedToId: string | null;
    }>;
}
