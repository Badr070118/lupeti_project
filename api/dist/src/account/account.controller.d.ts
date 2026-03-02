import type { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AccountService } from './account.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    getProfile(req: Request & {
        user?: JwtPayload;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: Request & {
        user?: JwtPayload;
    }, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listAddresses(req: Request & {
        user?: JwtPayload;
    }): Promise<{
        type: import(".prisma/client").$Enums.AddressType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string | null;
        phone: string | null;
        line1: string;
        line2: string | null;
        city: string;
        state: string | null;
        country: string;
        postalCode: string;
        label: string | null;
        isDefault: boolean;
    }[]>;
    createAddress(req: Request & {
        user?: JwtPayload;
    }, dto: CreateAddressDto): Promise<{
        type: import(".prisma/client").$Enums.AddressType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string | null;
        phone: string | null;
        line1: string;
        line2: string | null;
        city: string;
        state: string | null;
        country: string;
        postalCode: string;
        label: string | null;
        isDefault: boolean;
    }>;
    updateAddress(req: Request & {
        user?: JwtPayload;
    }, id: string, dto: UpdateAddressDto): Promise<{
        type: import(".prisma/client").$Enums.AddressType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string | null;
        phone: string | null;
        line1: string;
        line2: string | null;
        city: string;
        state: string | null;
        country: string;
        postalCode: string;
        label: string | null;
        isDefault: boolean;
    }>;
    removeAddress(req: Request & {
        user?: JwtPayload;
    }, id: string): Promise<{
        success: boolean;
    }>;
}
