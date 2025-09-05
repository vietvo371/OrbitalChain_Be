import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Observation } from '../observation/observation.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Observation,
      User,
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
