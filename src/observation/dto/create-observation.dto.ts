import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional, IsUrl, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateObservationDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  debris_id: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  location_lat: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  location_lon: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  location_alt: number;

  @IsOptional()
  @IsString()
  tx_hash?: string;
}
