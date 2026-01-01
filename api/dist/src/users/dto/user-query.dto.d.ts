import { Role, UserStatus } from '@prisma/client';
export declare class UserQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    status?: UserStatus;
}
