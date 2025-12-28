import { IsOptional, IsString } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  fullName!: string;

  @IsString()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city!: string;

  @IsString()
  country!: string;

  @IsString()
  postalCode!: string;
}
