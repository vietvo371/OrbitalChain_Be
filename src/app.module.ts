import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { DebrisModule } from './debris/debris.module';
import { ObservationModule } from './observation/observation.module';
import { ModerationModule } from './moderation/moderation.module';
import { BlockchainLogModule } from './blockchain_log/blockchain_log.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './database/seeders/seeder.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SearchModule } from './search/search.module';
import { MediaModule } from './media/media.module';
import { HealthModule } from './health/health.module';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    UserModule,
    DebrisModule,
    ObservationModule,
    ModerationModule,
    BlockchainLogModule,
                AuthModule,
            SeederModule,
            AnalyticsModule,
            SearchModule,
            MediaModule,
            HealthModule,
            BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
