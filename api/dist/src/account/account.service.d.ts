import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AccountService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listAddresses(userId: string): Promise<{
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
    createAddress(userId: string, dto: CreateAddressDto): Promise<{
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
    updateAddress(userId: string, id: string, dto: UpdateAddressDto): Promise<{
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
    removeAddress(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
