import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^[0-9+\-\s()]+$/, { message: 'Phone number can only contain digits, +, -, spaces, and parentheses' })
  phone: string;
}
