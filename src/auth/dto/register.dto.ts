import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty, Length, MinLength } from 'class-validator';
import { UserRole } from '../../user/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(42, 42, { message: 'Wallet address must be exactly 42 characters' })
  wallet_address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
