import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsDecimal } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDebrisDto {
  @IsString()
  @IsNotEmpty()
  catalog_id: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsDateString()
  epoch: string;

  @IsString()
  @IsNotEmpty()
  tle_line1: string;

  @IsString()
  @IsNotEmpty()
  tle_line2: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lon: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  alt: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  risk_score?: number;

  @IsOptional()
  @IsString()
  on_chain_tx?: string;
}
