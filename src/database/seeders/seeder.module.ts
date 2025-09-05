import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Debris } from '../../debris/debris.entity';
import { Observation } from '../../observation/observation.entity';
import { Moderation } from '../../moderation/moderation.entity';
import { BlockchainLog } from '../../blockchain_log/blockchain_log.entity';
import { UserSeeder } from './user.seeder';
import { DebrisSeeder } from './debris.seeder';
import { ObservationSeeder } from './observation.seeder';
import { ModerationSeeder } from './moderation.seeder';
import { BlockchainLogSeeder } from './blockchain-log.seeder';
import { MainSeeder } from './main.seeder';

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
  providers: [
    UserSeeder,
    DebrisSeeder,
    ObservationSeeder,
    ModerationSeeder,
    BlockchainLogSeeder,
    MainSeeder,
  ],
  exports: [MainSeeder],
})
export class SeederModule {}
