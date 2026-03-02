import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { SupportNotifierService } from '../support/support-notifier.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    private readonly settingsService;
    private readonly notifier;
    private readonly logger;
    constructor(prisma: PrismaService, settingsService: SettingsService, notifier: SupportNotifierService);
    checkout(userId: string, dto: CheckoutDto): Promise<{
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
        shippingAddress: Prisma.JsonValue;
    }>;
    listMyOrders(userId: string): Prisma.PrismaPromise<({
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
        shippingAddress: Prisma.JsonValue;
    })[]>;
    getMyOrder(userId: string, id: string): Promise<{
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
        shippingAddress: Prisma.JsonValue;
    }>;
    getOrder(id: string): Promise<{
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
        shippingAddress: Prisma.JsonValue;
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
            shippingAddress: Prisma.JsonValue;
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
        shippingAddress: Prisma.JsonValue;
    }>;
    private notifyOrderPlaced;
    private notifyOrderStatusChange;
    private formatStatus;
    private formatMoney;
}
