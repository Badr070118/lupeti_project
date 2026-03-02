import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    ping(): {
        message: string;
        timestamp: string;
    };
    overview(): Promise<{
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
