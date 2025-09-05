import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debris } from '../../debris/debris.entity';

@Injectable()
export class DebrisSeeder {
  constructor(
    @InjectRepository(Debris)
    private readonly debrisRepository: Repository<Debris>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding debris...');

    const debrisData = [
      {
        catalog_id: '25544',
        source: 'NORAD',
        epoch: new Date('2024-01-15T12:00:00Z'),
        tle_line1: '1 25544U 98067A   24015.50000000  .00000000  00000-0  00000+0 0  9990',
        tle_line2: '2 25544  51.6400 123.4567 0001234   0.0000   0.0000 15.12345678901234',
        lat: 51.6400,
        lon: 123.4567,
        alt: 400.5,
        risk_score: 8.5,
        on_chain_tx: '0xabc123def456789012345678901234567890123456789012345678901234567890',
      },
      {
        catalog_id: '25545',
        source: 'NORAD',
        epoch: new Date('2024-01-15T12:30:00Z'),
        tle_line1: '1 25545U 98067B   24015.52000000  .00000000  00000-0  00000+0 0  9991',
        tle_line2: '2 25545  52.1000 124.5678 0002345   0.0000   0.0000 15.23456789012345',
        lat: 52.1000,
        lon: 124.5678,
        alt: 350.2,
        risk_score: 6.2,
        on_chain_tx: '0xdef456abc789012345678901234567890123456789012345678901234567890123',
      },
      {
        catalog_id: '25546',
        source: 'ESA',
        epoch: new Date('2024-01-15T13:00:00Z'),
        tle_line1: '1 25546U 98067C   24015.54000000  .00000000  00000-0  00000+0 0  9992',
        tle_line2: '2 25546  53.2000 125.6789 0003456   0.0000   0.0000 15.34567890123456',
        lat: 53.2000,
        lon: 125.6789,
        alt: 500.8,
        risk_score: 4.1,
        on_chain_tx: '0xghi789jkl012345678901234567890123456789012345678901234567890123456',
      },
      {
        catalog_id: '25547',
        source: 'JAXA',
        epoch: new Date('2024-01-15T13:30:00Z'),
        tle_line1: '1 25547U 98067D   24015.56000000  .00000000  00000-0  00000+0 0  9993',
        tle_line2: '2 25547  54.3000 126.7890 0004567   0.0000   0.0000 15.45678901234567',
        lat: 54.3000,
        lon: 126.7890,
        alt: 600.3,
        risk_score: 9.8,
        on_chain_tx: '0xjkl012mno345678901234567890123456789012345678901234567890123456789',
      },
      {
        catalog_id: '25548',
        source: 'CNSA',
        epoch: new Date('2024-01-15T14:00:00Z'),
        tle_line1: '1 25548U 98067E   24015.58000000  .00000000  00000-0  00000+0 0  9994',
        tle_line2: '2 25548  55.4000 127.8901 0005678   0.0000   0.0000 15.56789012345678',
        lat: 55.4000,
        lon: 127.8901,
        alt: 450.7,
        risk_score: 7.3,
        on_chain_tx: '0xmno345pqr678901234567890123456789012345678901234567890123456789012',
      },
      {
        catalog_id: '25549',
        source: 'ISRO',
        epoch: new Date('2024-01-15T14:30:00Z'),
        tle_line1: '1 25549U 98067F   24015.60000000  .00000000  00000-0  00000+0 0  9995',
        tle_line2: '2 25549  56.5000 128.9012 0006789   0.0000   0.0000 15.67890123456789',
        lat: 56.5000,
        lon: 128.9012,
        alt: 380.9,
        risk_score: 5.6,
        on_chain_tx: '0xpqr678stu901234567890123456789012345678901234567890123456789012345',
      },
      {
        catalog_id: '25550',
        source: 'Roscosmos',
        epoch: new Date('2024-01-15T15:00:00Z'),
        tle_line1: '1 25550U 98067G   24015.62000000  .00000000  00000-0  00000+0 0  9996',
        tle_line2: '2 25550  57.6000 129.0123 0007890   0.0000   0.0000 15.78901234567890',
        lat: 57.6000,
        lon: 129.0123,
        alt: 550.1,
        risk_score: 3.9,
        on_chain_tx: '0xstu901vwx234567890123456789012345678901234567890123456789012345678',
      },
      {
        catalog_id: '25551',
        source: 'NORAD',
        epoch: new Date('2024-01-15T15:30:00Z'),
        tle_line1: '1 25551U 98067H   24015.64000000  .00000000  00000-0  00000+0 0  9997',
        tle_line2: '2 25551  58.7000 130.1234 0008901   0.0000   0.0000 15.89012345678901',
        lat: 58.7000,
        lon: 130.1234,
        alt: 420.6,
        risk_score: 8.2,
        on_chain_tx: '0xvwx234yza567890123456789012345678901234567890123456789012345678901',
      },
      {
        catalog_id: '25552',
        source: 'ESA',
        epoch: new Date('2024-01-15T16:00:00Z'),
        tle_line1: '1 25552U 98067J   24015.66000000  .00000000  00000-0  00000+0 0  9998',
        tle_line2: '2 25552  59.8000 131.2345 0009012   0.0000   0.0000 15.90123456789012',
        lat: 59.8000,
        lon: 131.2345,
        alt: 480.4,
        risk_score: 6.7,
        on_chain_tx: '0xyza567bcd890123456789012345678901234567890123456789012345678901234',
      },
      {
        catalog_id: '25553',
        source: 'JAXA',
        epoch: new Date('2024-01-15T16:30:00Z'),
        tle_line1: '1 25553U 98067K   24015.68000000  .00000000  00000-0  00000+0 0  9999',
        tle_line2: '2 25553  60.9000 132.3456 0010123   0.0000   0.0000 16.01234567890123',
        lat: 60.9000,
        lon: 132.3456,
        alt: 520.0,
        risk_score: 4.4,
        on_chain_tx: '0xbcd890efg123456789012345678901234567890123456789012345678901234567',
      },
    ];

    for (const debrisInfo of debrisData) {
      const existingDebris = await this.debrisRepository.findOne({
        where: { catalog_id: debrisInfo.catalog_id },
      });

      if (!existingDebris) {
        const debris = this.debrisRepository.create(debrisInfo);
        await this.debrisRepository.save(debris);
        console.log(`✅ Created debris: ${debrisInfo.catalog_id}`);
      } else {
        console.log(`⏭️  Debris already exists: ${debrisInfo.catalog_id}`);
      }
    }

    console.log('✅ Debris seeded successfully!');
  }

  async clear(): Promise<void> {
    await this.debrisRepository.delete({});
  }
}
