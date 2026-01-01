import { IsOptional, IsString, MaxLength } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class RegisterDto extends AuthCredentialsDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}
