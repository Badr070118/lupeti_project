import { Role, UserStatus } from '@prisma/client';
export interface AuthenticatedUser {
    id: string;
    email: string;
    role: Role;
    name?: string | null;
    status: UserStatus;
    createdAt: Date;
}
export interface AuthResponseDto {
    accessToken: string;
    user: AuthenticatedUser;
}
