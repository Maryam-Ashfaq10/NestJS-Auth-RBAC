import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}