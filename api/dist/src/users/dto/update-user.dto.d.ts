import { Role, UserStatus } from '@prisma/client';
export declare class UpdateUserDto {
    email?: string;
    name?: string;
    role?: Role;
    status?: UserStatus;
}
