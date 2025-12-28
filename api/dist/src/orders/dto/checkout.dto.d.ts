import { ShippingAddressDto } from './shipping-address.dto';
export declare class CheckoutDto {
    shippingAddress: ShippingAddressDto;
    shippingMethod?: 'STANDARD' | 'EXPRESS';
}
