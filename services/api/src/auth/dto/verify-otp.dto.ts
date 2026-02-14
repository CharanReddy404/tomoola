import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsOptional()
  @IsIn(['CLIENT', 'ARTIST', 'ADMIN'])
  role?: 'CLIENT' | 'ARTIST' | 'ADMIN';
}
