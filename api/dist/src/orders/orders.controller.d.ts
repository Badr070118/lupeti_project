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
            productId: string;
            quantity: number;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            lineTotalCents: number;
            orderId: string;
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
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
    }>;
    myOrders(req: Request & {
        user?: JwtPayload;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            productId: string;
            quantity: number;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            lineTotalCents: number;
            orderId: string;
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
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
    })[]>;
    myOrder(req: Request & {
        user?: JwtPayload;
    }, id: string): Promise<{
        items: {
            id: string;
            productId: string;
            quantity: number;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            lineTotalCents: number;
            orderId: string;
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
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
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
                productId: string;
                quantity: number;
                titleSnapshot: string;
                priceCentsSnapshot: number;
                lineTotalCents: number;
                orderId: string;
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
            shippingAddress: import("@prisma/client/runtime/library").JsonValue;
            shippingMethod: string | null;
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
            productId: string;
            quantity: number;
            titleSnapshot: string;
            priceCentsSnapshot: number;
            lineTotalCents: number;
            orderId: string;
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
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
    }>;
}
