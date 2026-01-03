import { IsOptional, IsString } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  country!: string;

  @IsString()
  postalCode!: string;
}
