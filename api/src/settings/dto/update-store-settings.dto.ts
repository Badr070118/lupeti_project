import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateStoreSettingsDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsString()
  supportAddress?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  shippingStandardCents?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  shippingExpressCents?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsBoolean()
  enableCheckout?: boolean;

  @IsOptional()
  @IsBoolean()
  enableSupport?: boolean;

  @IsOptional()
  @IsBoolean()
  paytrEnabled?: boolean;
}
