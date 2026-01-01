import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { SupportQueryDto } from './dto/support-query.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { SupportNotifierService } from './support-notifier.service';
export declare class SupportService {
    private readonly prisma;
    private readonly notifier;
    constructor(prisma: PrismaService, notifier: SupportNotifierService);
    createTicket(dto: CreateSupportTicketDto, user?: JwtPayload | null): Promise<{
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
    listTickets(query: SupportQueryDto): Promise<{
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
    getTicket(id: string): Promise<{
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
    updateStatus(id: string, dto: UpdateTicketStatusDto, adminId: string): Promise<{
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
    replyToTicket(id: string, dto: ReplyTicketDto, admin: JwtPayload): Promise<{
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
    private buildWhere;
    private ensureTicketExists;
}
