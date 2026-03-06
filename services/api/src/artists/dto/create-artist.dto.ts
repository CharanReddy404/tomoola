import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  groupName: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsArray()
  @IsString({ each: true })
  artFormIds: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  groupSize?: number;

  @IsInt()
  @Type(() => Number)
  @Min(500, { message: 'Base price must be at least ₹500' })
  @Max(10000000, { message: 'Base price cannot exceed ₹1,00,00,000' })
  basePrice: number;

  @IsOptional()
  @IsString()
  priceUnit?: string;

  @IsArray()
  @IsString({ each: true })
  serviceAreas: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  basedIn: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  experience?: number;
}
