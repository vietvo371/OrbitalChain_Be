import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
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
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
