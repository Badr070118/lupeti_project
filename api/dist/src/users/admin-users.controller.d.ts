import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UsersService } from './users.service';
export declare class AdminUsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    list(query: UserQueryDto): Promise<{
        data: {
            ordersCount: number;
            totalSpentCents: number;
            lastOrderAt: Date | null;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<{
        ordersCount: number;
        totalSpentCents: number;
        lastOrderAt: Date | null;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        orders: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            currency: string;
            totalCents: number;
        }[];
    }>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resetPassword(id: string, dto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
