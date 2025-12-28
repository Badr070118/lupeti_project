import { IsUUID } from 'class-validator';

export class PaytrInitiateDto {
  @IsUUID()
  orderId!: string;
}
