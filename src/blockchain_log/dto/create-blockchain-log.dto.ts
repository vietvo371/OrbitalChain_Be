import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlockchainLogDto {
  @IsUUID()
  @IsNotEmpty()
  debris_id: string;

  @IsString()
  @IsNotEmpty()
  tx_hash: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  block_number: number;
}
