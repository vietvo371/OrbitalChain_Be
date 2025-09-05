import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observation } from './observation.entity';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';

@Injectable()
export class ObservationService {
  constructor(
    @InjectRepository(Observation)
    private readonly observationRepository: Repository<Observation>,
  ) {}

  async create(createObservationDto: CreateObservationDto): Promise<Observation> {
    const observation = this.observationRepository.create(createObservationDto);
    return await this.observationRepository.save(observation);
  }

  async findAll(): Promise<Observation[]> {
    return await this.observationRepository.find({
      relations: ['user', 'debris', 'moderation'],
    });
  }

  async findOne(id: string): Promise<Observation> {
    const observation = await this.observationRepository.findOne({
      where: { id },
      relations: ['user', 'debris', 'moderation'],
    });

    if (!observation) {
      throw new NotFoundException(`Observation with ID ${id} not found`);
    }

    return observation;
  }

  async findByUser(userId: string): Promise<Observation[]> {
    return await this.observationRepository.find({
      where: { user_id: userId },
      relations: ['user', 'debris', 'moderation'],
    });
  }

  async findByDebris(debrisId: string): Promise<Observation[]> {
    return await this.observationRepository.find({
      where: { debris_id: debrisId },
      relations: ['user', 'debris', 'moderation'],
    });
  }

  async findPendingApproval(): Promise<Observation[]> {
    return await this.observationRepository.find({
      where: { approved: false },
      relations: ['user', 'debris', 'moderation'],
    });
  }

  async findApproved(): Promise<Observation[]> {
    return await this.observationRepository.find({
      where: { approved: true },
      relations: ['user', 'debris', 'moderation'],
    });
  }

  async update(id: string, updateObservationDto: UpdateObservationDto): Promise<Observation> {
    const observation = await this.findOne(id);
    Object.assign(observation, updateObservationDto);
    return await this.observationRepository.save(observation);
  }

  async remove(id: string): Promise<void> {
    const observation = await this.findOne(id);
    await this.observationRepository.remove(observation);
  }

  async approve(id: string): Promise<Observation> {
    const observation = await this.findOne(id);
    observation.approved = true;
    return await this.observationRepository.save(observation);
  }

  async reject(id: string): Promise<Observation> {
    const observation = await this.findOne(id);
    observation.approved = false;
    return await this.observationRepository.save(observation);
  }
}
