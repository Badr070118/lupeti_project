import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverview(): Promise<{
        products: {
            total: number;
            stock: number;
        };
        users: {
            total: number;
            active: number;
        };
        orders: {
            total: number;
            revenueCents: number;
        };
        tickets: {
            total: number;
            open: number;
        };
        performance: {
            ordersLast7Days: number;
            ordersLast30Days: number;
            revenueLast30Cents: number;
            averageOrderValueCents: number;
            newCustomersLast30Days: number;
        };
        bestSellers: {
            productId: string;
            title: string;
            slug: string;
            unitsSold: number;
            revenueCents: number;
        }[];
    }>;
}
