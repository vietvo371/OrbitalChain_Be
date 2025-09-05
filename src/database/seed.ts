import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MainSeeder } from './seeders/main.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(MainSeeder);

  const command = process.argv[2];

  try {
    if (command === 'seed') {
      await seeder.seedAll();
    } else if (command === 'clear') {
      await seeder.clearAll();
    } else if (command === 'reset') {
      await seeder.clearAll();
      await seeder.seedAll();
    } else {
      console.log('Usage:');
      console.log('  yarn seed:run seed   - Seed the database');
      console.log('  yarn seed:run clear  - Clear all seeded data');
      console.log('  yarn seed:run reset  - Clear and reseed the database');
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
