import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { User } from '../user/user.entity';
import { Debris } from '../debris/debris.entity';
import { Observation } from '../observation/observation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Debris,
      Observation,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
