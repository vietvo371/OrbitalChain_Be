import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockchainLog } from '../../blockchain_log/blockchain_log.entity';
import { Debris } from '../../debris/debris.entity';

@Injectable()
export class BlockchainLogSeeder {
  constructor(
    @InjectRepository(BlockchainLog)
    private readonly blockchainLogRepository: Repository<BlockchainLog>,
    @InjectRepository(Debris)
    private readonly debrisRepository: Repository<Debris>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding blockchain logs...');

    // Get debris for creating blockchain logs
    const debris = await this.debrisRepository.find();

    if (debris.length === 0) {
      console.log('⚠️  No debris found. Please seed debris first.');
      return;
    }

    const blockchainLogs = [
      {
        debris_id: debris[0].id,
        tx_hash: '0xabc123def456789012345678901234567890123456789012345678901234567890',
        block_number: 18500000,
        committed_at: new Date('2024-01-15T12:00:00Z'),
      },
      {
        debris_id: debris[1].id,
        tx_hash: '0xdef456abc789012345678901234567890123456789012345678901234567890123',
        block_number: 18500001,
        committed_at: new Date('2024-01-15T12:30:00Z'),
      },
      {
        debris_id: debris[2].id,
        tx_hash: '0xghi789jkl012345678901234567890123456789012345678901234567890123456',
        block_number: 18500002,
        committed_at: new Date('2024-01-15T13:00:00Z'),
      },
      {
        debris_id: debris[3].id,
        tx_hash: '0xjkl012mno345678901234567890123456789012345678901234567890123456789',
        block_number: 18500003,
        committed_at: new Date('2024-01-15T13:30:00Z'),
      },
      {
        debris_id: debris[4].id,
        tx_hash: '0xmno345pqr678901234567890123456789012345678901234567890123456789012',
        block_number: 18500004,
        committed_at: new Date('2024-01-15T14:00:00Z'),
      },
      {
        debris_id: debris[5].id,
        tx_hash: '0xpqr678stu901234567890123456789012345678901234567890123456789012345',
        block_number: 18500005,
        committed_at: new Date('2024-01-15T14:30:00Z'),
      },
      {
        debris_id: debris[6].id,
        tx_hash: '0xstu901vwx234567890123456789012345678901234567890123456789012345678',
        block_number: 18500006,
        committed_at: new Date('2024-01-15T15:00:00Z'),
      },
      {
        debris_id: debris[7].id,
        tx_hash: '0xvwx234yza567890123456789012345678901234567890123456789012345678901',
        block_number: 18500007,
        committed_at: new Date('2024-01-15T15:30:00Z'),
      },
      {
        debris_id: debris[8].id,
        tx_hash: '0xyza567bcd890123456789012345678901234567890123456789012345678901234',
        block_number: 18500008,
        committed_at: new Date('2024-01-15T16:00:00Z'),
      },
      {
        debris_id: debris[9].id,
        tx_hash: '0xbcd890efg123456789012345678901234567890123456789012345678901234567',
        block_number: 18500009,
        committed_at: new Date('2024-01-15T16:30:00Z'),
      },
      // Additional logs for some debris
      {
        debris_id: debris[0].id,
        tx_hash: '0xupdate123def456789012345678901234567890123456789012345678901234567890',
        block_number: 18500010,
        committed_at: new Date('2024-01-15T17:00:00Z'),
      },
      {
        debris_id: debris[1].id,
        tx_hash: '0xupdate456abc789012345678901234567890123456789012345678901234567890123',
        block_number: 18500011,
        committed_at: new Date('2024-01-15T17:30:00Z'),
      },
      {
        debris_id: debris[2].id,
        tx_hash: '0xupdate789jkl012345678901234567890123456789012345678901234567890123456',
        block_number: 18500012,
        committed_at: new Date('2024-01-15T18:00:00Z'),
      },
    ];

    for (const logData of blockchainLogs) {
      const blockchainLog = this.blockchainLogRepository.create(logData);
      await this.blockchainLogRepository.save(blockchainLog);
      console.log(`✅ Created blockchain log for debris ${logData.debris_id}`);
    }

    console.log('✅ Blockchain logs seeded successfully!');
  }

  async clear(): Promise<void> {
    await this.blockchainLogRepository.delete({});
  }
}
