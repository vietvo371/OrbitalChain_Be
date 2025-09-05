import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { User } from '../user/user.entity';
import { Debris } from '../debris/debris.entity';
import { Observation } from '../observation/observation.entity';
import { Moderation } from '../moderation/moderation.entity';
import { BlockchainLog } from '../blockchain_log/blockchain_log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Debris,
      Observation,
      Moderation,
      BlockchainLog,
    ]),
  ],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
