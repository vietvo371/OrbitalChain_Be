import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockchainLogDto } from './create-blockchain-log.dto';

export class UpdateBlockchainLogDto extends PartialType(CreateBlockchainLogDto) {}
