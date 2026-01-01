import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkout(userId: string, dto: CheckoutDto): Promise<{
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
        shippingAddress: Prisma.JsonValue;
        shippingMethod: string | null;
    }>;
    listMyOrders(userId: string): Prisma.PrismaPromise<({
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
        shippingAddress: Prisma.JsonValue;
        shippingMethod: string | null;
    })[]>;
    getMyOrder(userId: string, id: string): Promise<{
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
        shippingAddress: Prisma.JsonValue;
        shippingMethod: string | null;
    }>;
    listAllOrders(query: OrdersQueryDto): Promise<{
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
            shippingAddress: Prisma.JsonValue;
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
        shippingAddress: Prisma.JsonValue;
        shippingMethod: string | null;
    }>;
    private calculateShipping;
}
