import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observation } from '../../observation/observation.entity';
import { User } from '../../user/user.entity';
import { Debris } from '../../debris/debris.entity';

@Injectable()
export class ObservationSeeder {
  constructor(
    @InjectRepository(Observation)
    private readonly observationRepository: Repository<Observation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Debris)
    private readonly debrisRepository: Repository<Debris>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding observations...');

    // Get some users and debris for creating observations
    const users = await this.userRepository.find({ take: 5 });
    const debris = await this.debrisRepository.find({ take: 10 });

    if (users.length === 0 || debris.length === 0) {
      console.log('⚠️  No users or debris found. Please seed users and debris first.');
      return;
    }

    const observations = [
      {
        user_id: users[0].id,
        debris_id: debris[0].id,
        image_url: 'https://example.com/images/observation1.jpg',
        note: 'Clear observation of debris object, appears to be tumbling',
        location_lat: 51.6400,
        location_lon: 123.4567,
        location_alt: 400.5,
        approved: true,
        submitted_at: new Date('2024-01-15T14:00:00Z'),
        tx_hash: '0xobs123def456789012345678901234567890123456789012345678901234567890',
      },
      {
        user_id: users[1].id,
        debris_id: debris[1].id,
        image_url: 'https://example.com/images/observation2.jpg',
        note: 'Debris object moving at high velocity, difficult to track',
        location_lat: 52.1000,
        location_lon: 124.5678,
        location_alt: 350.2,
        approved: false,
        submitted_at: new Date('2024-01-15T14:30:00Z'),
        tx_hash: '0xobs456abc789012345678901234567890123456789012345678901234567890123',
      },
      {
        user_id: users[2].id,
        debris_id: debris[2].id,
        image_url: 'https://example.com/images/observation3.jpg',
        note: 'Stable debris object, good visibility conditions',
        location_lat: 53.2000,
        location_lon: 125.6789,
        location_alt: 500.8,
        approved: true,
        submitted_at: new Date('2024-01-15T15:00:00Z'),
        tx_hash: '0xobs789ghi012345678901234567890123456789012345678901234567890123456',
      },
      {
        user_id: users[0].id,
        debris_id: debris[3].id,
        image_url: 'https://example.com/images/observation4.jpg',
        note: 'Large debris object, potential collision risk',
        location_lat: 54.3000,
        location_lon: 126.7890,
        location_alt: 600.3,
        approved: true,
        submitted_at: new Date('2024-01-15T15:30:00Z'),
        tx_hash: '0xobs012jkl345678901234567890123456789012345678901234567890123456789',
      },
      {
        user_id: users[3].id,
        debris_id: debris[4].id,
        image_url: 'https://example.com/images/observation5.jpg',
        note: 'Debris object showing unusual behavior patterns',
        location_lat: 55.4000,
        location_lon: 127.8901,
        location_alt: 450.7,
        approved: false,
        submitted_at: new Date('2024-01-15T16:00:00Z'),
        tx_hash: '0xobs345mno678901234567890123456789012345678901234567890123456789012',
      },
      {
        user_id: users[1].id,
        debris_id: debris[5].id,
        image_url: 'https://example.com/images/observation6.jpg',
        note: 'Small debris object, good tracking data',
        location_lat: 56.5000,
        location_lon: 128.9012,
        location_alt: 380.9,
        approved: true,
        submitted_at: new Date('2024-01-15T16:30:00Z'),
        tx_hash: '0xobs678pqr901234567890123456789012345678901234567890123456789012345',
      },
      {
        user_id: users[4].id,
        debris_id: debris[6].id,
        image_url: 'https://example.com/images/observation7.jpg',
        note: 'Debris object in stable orbit, low risk',
        location_lat: 57.6000,
        location_lon: 129.0123,
        location_alt: 550.1,
        approved: true,
        submitted_at: new Date('2024-01-15T17:00:00Z'),
        tx_hash: '0xobs901stu234567890123456789012345678901234567890123456789012345678',
      },
      {
        user_id: users[2].id,
        debris_id: debris[7].id,
        image_url: 'https://example.com/images/observation8.jpg',
        note: 'High-altitude debris object, atmospheric drag minimal',
        location_lat: 58.7000,
        location_lon: 130.1234,
        location_alt: 420.6,
        approved: false,
        submitted_at: new Date('2024-01-15T17:30:00Z'),
        tx_hash: '0xobs234vwx567890123456789012345678901234567890123456789012345678901',
      },
      {
        user_id: users[0].id,
        debris_id: debris[8].id,
        image_url: 'https://example.com/images/observation9.jpg',
        note: 'Debris object showing signs of fragmentation',
        location_lat: 59.8000,
        location_lon: 131.2345,
        location_alt: 480.4,
        approved: true,
        submitted_at: new Date('2024-01-15T18:00:00Z'),
        tx_hash: '0xobs567yza890123456789012345678901234567890123456789012345678901234',
      },
      {
        user_id: users[3].id,
        debris_id: debris[9].id,
        image_url: 'https://example.com/images/observation10.jpg',
        note: 'New debris object, requires further monitoring',
        location_lat: 60.9000,
        location_lon: 132.3456,
        location_alt: 520.0,
        approved: false,
        submitted_at: new Date('2024-01-15T18:30:00Z'),
        tx_hash: '0xobs890bcd123456789012345678901234567890123456789012345678901234567',
      },
    ];

    for (const observationData of observations) {
      const observation = this.observationRepository.create(observationData);
      await this.observationRepository.save(observation);
      console.log(`✅ Created observation for debris ${observationData.debris_id}`);
    }

    console.log('✅ Observations seeded successfully!');
  }

  async clear(): Promise<void> {
    await this.observationRepository.delete({});
  }
}
