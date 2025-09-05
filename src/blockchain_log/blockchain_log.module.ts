import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainLogService } from './blockchain_log.service';
import { BlockchainLogController } from './blockchain_log.controller';
import { BlockchainLog } from './blockchain_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockchainLog])],
  controllers: [BlockchainLogController],
  providers: [BlockchainLogService],
  exports: [BlockchainLogService],
})
export class BlockchainLogModule {}
