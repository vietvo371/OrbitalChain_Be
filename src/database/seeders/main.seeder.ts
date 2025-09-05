import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { DebrisSeeder } from './debris.seeder';
import { ObservationSeeder } from './observation.seeder';
import { ModerationSeeder } from './moderation.seeder';
import { BlockchainLogSeeder } from './blockchain-log.seeder';

@Injectable()
export class MainSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly debrisSeeder: DebrisSeeder,
    private readonly observationSeeder: ObservationSeeder,
    private readonly moderationSeeder: ModerationSeeder,
    private readonly blockchainLogSeeder: BlockchainLogSeeder,
  ) {}

  async seedAll(): Promise<void> {
    console.log('🚀 Starting database seeding...');
    console.log('================================');

    try {
      // Seed in order due to dependencies
      await this.userSeeder.seed();
      console.log('');

      await this.debrisSeeder.seed();
      console.log('');

      await this.observationSeeder.seed();
      console.log('');

      await this.moderationSeeder.seed();
      console.log('');

      await this.blockchainLogSeeder.seed();
      console.log('');

      console.log('================================');
      console.log('✅ Database seeding completed successfully!');
      console.log('');
      console.log('📊 Summary:');
      console.log('- Users: 6 (1 admin, 1 moderator, 4 users)');
      console.log('- Debris: 10 space debris objects');
      console.log('- Observations: 10 user observations');
      console.log('- Moderations: 10 moderation records');
      console.log('- Blockchain Logs: 13 transaction logs');
      console.log('');
      console.log('🔑 Test Credentials:');
      console.log('Admin: admin@orbitalchain.com / admin123');
      console.log('Moderator: moderator@orbitalchain.com / moderator123');
      console.log('User: user1@orbitalchain.com / user123');
      console.log('');
      console.log('🌐 API Endpoints:');
      console.log('- Health: http://localhost:3000/api/v1/health');
      console.log('- Auth: http://localhost:3000/api/v1/auth');
      console.log('- Users: http://localhost:3000/api/v1/users');
      console.log('- Debris: http://localhost:3000/api/v1/debris');
      console.log('- Observations: http://localhost:3000/api/v1/observations');
      console.log('- Moderations: http://localhost:3000/api/v1/moderations');
      console.log('- Blockchain Logs: http://localhost:3000/api/v1/blockchain-logs');

    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    console.log('🧹 Clearing all seeded data...');
    console.log('================================');

    try {
      // Clear in reverse order due to foreign key constraints
      await this.blockchainLogSeeder.clear();
      console.log('✅ Cleared blockchain logs');

      await this.moderationSeeder.clear();
      console.log('✅ Cleared moderations');

      await this.observationSeeder.clear();
      console.log('✅ Cleared observations');

      await this.debrisSeeder.clear();
      console.log('✅ Cleared debris');

      await this.userSeeder.clear();
      console.log('✅ Cleared users');

      console.log('================================');
      console.log('✅ Database cleared successfully!');

    } catch (error) {
      console.error('❌ Error during clearing:', error);
      throw error;
    }
  }
}
