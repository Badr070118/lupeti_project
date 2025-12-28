import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaytrCallbackDto {
  @IsString()
  merchant_oid!: string;

  @IsString()
  status!: string;

  @IsNumberString()
  total_amount!: string;

  @IsString()
  hash!: string;

  @IsOptional()
  @IsString()
  failed_reason_msg?: string;

  @IsOptional()
  @IsString()
  failed_reason_code?: string;

  @IsOptional()
  @IsString()
  payment_type?: string;
}
