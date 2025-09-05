import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Moderation } from './moderation.entity';
import { CreateModerationDto } from './dto/create-moderation.dto';
import { UpdateModerationDto } from './dto/update-moderation.dto';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(Moderation)
    private readonly moderationRepository: Repository<Moderation>,
  ) {}

  async create(createModerationDto: CreateModerationDto): Promise<Moderation> {
    // Check if moderation for this observation already exists
    const existingModeration = await this.moderationRepository.findOne({
      where: { observation_id: createModerationDto.observation_id },
    });

    if (existingModeration) {
      throw new ConflictException('Moderation for this observation already exists');
    }

    const moderation = this.moderationRepository.create(createModerationDto);
    return await this.moderationRepository.save(moderation);
  }

  async findAll(): Promise<Moderation[]> {
    return await this.moderationRepository.find({
      relations: ['moderator', 'observation'],
    });
  }

  async findOne(id: string): Promise<Moderation> {
    const moderation = await this.moderationRepository.findOne({
      where: { id },
      relations: ['moderator', 'observation'],
    });

    if (!moderation) {
      throw new NotFoundException(`Moderation with ID ${id} not found`);
    }

    return moderation;
  }

  async findByModerator(moderatorId: string): Promise<Moderation[]> {
    return await this.moderationRepository.find({
      where: { moderator_id: moderatorId },
      relations: ['moderator', 'observation'],
    });
  }

  async findByObservation(observationId: string): Promise<Moderation> {
    const moderation = await this.moderationRepository.findOne({
      where: { observation_id: observationId },
      relations: ['moderator', 'observation'],
    });

    if (!moderation) {
      throw new NotFoundException(`Moderation for observation ${observationId} not found`);
    }

    return moderation;
  }

  async update(id: string, updateModerationDto: UpdateModerationDto): Promise<Moderation> {
    const moderation = await this.findOne(id);
    Object.assign(moderation, updateModerationDto);
    return await this.moderationRepository.save(moderation);
  }

  async remove(id: string): Promise<void> {
    const moderation = await this.findOne(id);
    await this.moderationRepository.remove(moderation);
  }

  async getModerationStats(): Promise<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  }> {
    const [total, approved, rejected] = await Promise.all([
      this.moderationRepository.count(),
      this.moderationRepository.count({ where: { approved: true } }),
      this.moderationRepository.count({ where: { approved: false } }),
    ]);

    return {
      total,
      approved,
      rejected,
      pending: total - approved - rejected,
    };
  }
}
