import type { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { SupportQueryDto } from './dto/support-query.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { SupportService } from './support.service';
export declare class SupportAdminController {
    private readonly supportService;
    constructor(supportService: SupportService);
    list(query: SupportQueryDto): Promise<{
        data: ({
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    get(id: string): Promise<{
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
    updateStatus(id: string, dto: UpdateTicketStatusDto, req: Request & {
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
    reply(id: string, dto: ReplyTicketDto, req: Request & {
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
