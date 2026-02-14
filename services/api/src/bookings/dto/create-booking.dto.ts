import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  artistProfileId: string;

  @IsString()
  @IsNotEmpty()
  eventDate: string;

  @IsOptional()
  @IsString()
  eventTime?: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsString()
  @IsNotEmpty()
  eventLocation: string;

  @IsOptional()
  @IsString()
  venueAddress?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  duration?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
