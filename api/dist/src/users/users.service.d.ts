import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: UserQueryDto): Promise<{
        data: {
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
    private buildWhere;
    private ensureAnotherAdminExists;
    private hashSecret;
}
