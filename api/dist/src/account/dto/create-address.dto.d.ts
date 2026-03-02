import { AddressType } from '@prisma/client';
export declare class CreateAddressDto {
    label?: string;
    fullName: string;
    phone?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    type?: AddressType;
    isDefault?: boolean;
}
