import { PartialType } from '@nestjs/mapped-types';
import { CreateObservationDto } from './create-observation.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateObservationDto extends PartialType(CreateObservationDto) {
  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}
