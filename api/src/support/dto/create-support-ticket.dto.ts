import { TicketCategory } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSupportTicketDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(120)
  subject!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;

  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;
}
