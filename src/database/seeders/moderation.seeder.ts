import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moderation } from '../../moderation/moderation.entity';
import { Observation } from '../../observation/observation.entity';
import { User, UserRole } from '../../user/user.entity';

@Injectable()
export class ModerationSeeder {
  constructor(
    @InjectRepository(Moderation)
    private readonly moderationRepository: Repository<Moderation>,
    @InjectRepository(Observation)
    private readonly observationRepository: Repository<Observation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding moderations...');

    // Get moderators and observations
    const moderators = await this.userRepository.find({
      where: { role: UserRole.MODERATOR },
    });
    const observations = await this.observationRepository.find();

    if (moderators.length === 0) {
      console.log('⚠️  No moderators found. Please seed users first.');
      return;
    }

    if (observations.length === 0) {
      console.log('⚠️  No observations found. Please seed observations first.');
      return;
    }

    const moderations = [
      {
        observation_id: observations[0].id,
        moderator_id: moderators[0].id,
        approved: true,
        approved_at: new Date('2024-01-15T15:00:00Z'),
      },
      {
        observation_id: observations[1].id,
        moderator_id: moderators[0].id,
        approved: false,
        approved_at: new Date('2024-01-15T15:30:00Z'),
      },
      {
        observation_id: observations[2].id,
        moderator_id: moderators[0].id,
        approved: true,
        approved_at: new Date('2024-01-15T16:00:00Z'),
      },
      {
        observation_id: observations[3].id,
        moderator_id: moderators[0].id,
        approved: true,
        approved_at: new Date('2024-01-15T16:30:00Z'),
      },
      {
        observation_id: observations[4].id,
        moderator_id: moderators[0].id,
        approved: false,
        approved_at: new Date('2024-01-15T17:00:00Z'),
      },
      {
        observation_id: observations[5].id,
        moderator_id: moderators[0].id,
        approved: true,
        approved_at: new Date('2024-01-15T17:30:00Z'),
      },
      {
        observation_id: observations[6].id,
        moderator_id: moderators[0].id,
        approved: true,
        approved_at: new Date('2024-01-15T18:00:00Z'),
      },
      {
        observation_id: observations[7].id,
        moderator_id: moderators[0].id,
        approved: false,
        approved_at: new Date('2024-01-15T18:30:00Z'),
      },
      {
        observation_id: observations[8].id,
        moderator_id: moderators[0].id,
        approved: true,
        approved_at: new Date('2024-01-15T19:00:00Z'),
      },
      {
        observation_id: observations[9].id,
        moderator_id: moderators[0].id,
        approved: false,
        approved_at: new Date('2024-01-15T19:30:00Z'),
      },
    ];

    for (const moderationData of moderations) {
      // Check if moderation already exists for this observation
      const existingModeration = await this.moderationRepository.findOne({
        where: { observation_id: moderationData.observation_id },
      });

      if (!existingModeration) {
        const moderation = this.moderationRepository.create(moderationData);
        await this.moderationRepository.save(moderation);
        console.log(`✅ Created moderation for observation ${moderationData.observation_id}`);
      } else {
        console.log(`⏭️  Moderation already exists for observation ${moderationData.observation_id}`);
      }
    }

    console.log('✅ Moderations seeded successfully!');
  }

  async clear(): Promise<void> {
    await this.moderationRepository.delete({});
  }
}
