import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  groupName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  artFormIds?: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  groupSize?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  basePrice?: number;

  @IsOptional()
  @IsString()
  priceUnit?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceAreas?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  basedIn?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  experience?: number;
}
