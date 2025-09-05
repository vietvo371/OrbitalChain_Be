import { PartialType } from '@nestjs/mapped-types';
import { CreateDebrisDto } from './create-debris.dto';

export class UpdateDebrisDto extends PartialType(CreateDebrisDto) {}
