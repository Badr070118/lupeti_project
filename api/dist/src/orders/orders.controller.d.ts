import type { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    private getUserId;
    checkout(req: Request & {
        user?: JwtPayload;
    }, dto: CheckoutDto): Promise<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            quantity: number;
            lineTotalCents: number;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        totalCents: number;
        subtotalCents: number;
        shippingCents: number;
        shippingMethod: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
    }>;
    myOrders(req: Request & {
        user?: JwtPayload;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            orderId: string;
            productId: string;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            quantity: number;
            lineTotalCents: number;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        totalCents: number;
        subtotalCents: number;
        shippingCents: number;
        shippingMethod: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
    })[]>;
    myOrder(req: Request & {
        user?: JwtPayload;
    }, id: string): Promise<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            quantity: number;
            lineTotalCents: number;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        totalCents: number;
        subtotalCents: number;
        shippingCents: number;
        shippingMethod: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getById(id: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
        items: {
            id: string;
            orderId: string;
            productId: string;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            quantity: number;
            lineTotalCents: number;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        totalCents: number;
        subtotalCents: number;
        shippingCents: number;
        shippingMethod: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
    }>;
    listAll(query: OrdersQueryDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
            };
            items: {
                id: string;
                orderId: string;
                productId: string;
                titleSnapshot: string;
                priceCentsSnapshot: number;
                quantity: number;
                lineTotalCents: number;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            userId: string;
            totalCents: number;
            subtotalCents: number;
            shippingCents: number;
            shippingMethod: string | null;
            shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            quantity: number;
            lineTotalCents: number;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        totalCents: number;
        subtotalCents: number;
        shippingCents: number;
        shippingMethod: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
