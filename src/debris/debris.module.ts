import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebrisService } from './debris.service';
import { DebrisController } from './debris.controller';
import { Debris } from './debris.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Debris])],
  controllers: [DebrisController],
  providers: [DebrisService],
  exports: [DebrisService],
})
export class DebrisModule {}
