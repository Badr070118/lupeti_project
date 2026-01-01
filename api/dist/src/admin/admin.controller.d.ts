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
    }>;
}
