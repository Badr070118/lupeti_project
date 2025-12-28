import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ShippingAddressDto } from './shipping-address.dto';

export class CheckoutDto {
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;

  @IsOptional()
  @IsString()
  @IsIn(['STANDARD', 'EXPRESS'], {
    message: 'shippingMethod must be STANDARD or EXPRESS',
  })
  shippingMethod?: 'STANDARD' | 'EXPRESS';
}
