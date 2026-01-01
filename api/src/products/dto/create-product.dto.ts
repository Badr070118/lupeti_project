import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { DiscountType } from '@prisma/client';
import { CreateProductImageDto } from './create-product-image.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(0)
  priceCents!: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  originalPriceCents?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsInt()
  @Min(0)
  discountValue?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  promoStartAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  promoEndAt?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}
