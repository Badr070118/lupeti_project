import { AddressType } from '@prisma/client';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string;

  @IsString()
  @MaxLength(120)
  fullName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsString()
  @MaxLength(140)
  line1!: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  line2?: string;

  @IsString()
  @MaxLength(80)
  city!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  state?: string;

  @IsString()
  @MaxLength(20)
  postalCode!: string;

  @IsString()
  @MaxLength(80)
  country!: string;

  @IsOptional()
  @IsIn(Object.values(AddressType))
  type?: AddressType;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
