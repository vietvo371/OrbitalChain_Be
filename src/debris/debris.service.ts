import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debris } from './debris.entity';
import { CreateDebrisDto } from './dto/create-debris.dto';
import { UpdateDebrisDto } from './dto/update-debris.dto';

@Injectable()
export class DebrisService {
  constructor(
    @InjectRepository(Debris)
    private readonly debrisRepository: Repository<Debris>,
  ) {}

  async create(createDebrisDto: CreateDebrisDto): Promise<Debris> {
    // Check if debris with catalog_id already exists
    const existingDebris = await this.debrisRepository.findOne({
      where: { catalog_id: createDebrisDto.catalog_id },
    });

    if (existingDebris) {
      throw new ConflictException('Debris with this catalog ID already exists');
    }

    const debris = this.debrisRepository.create(createDebrisDto);
    return await this.debrisRepository.save(debris);
  }

  async findAll(): Promise<Debris[]> {
    return await this.debrisRepository.find({
      relations: ['observations', 'blockchain_logs'],
    });
  }

  async findOne(id: string): Promise<Debris> {
    const debris = await this.debrisRepository.findOne({
      where: { id },
      relations: ['observations', 'blockchain_logs'],
    });

    if (!debris) {
      throw new NotFoundException(`Debris with ID ${id} not found`);
    }

    return debris;
  }

  async findByCatalogId(catalogId: string): Promise<Debris> {
    const debris = await this.debrisRepository.findOne({
      where: { catalog_id: catalogId },
      relations: ['observations', 'blockchain_logs'],
    });

    if (!debris) {
      throw new NotFoundException(`Debris with catalog ID ${catalogId} not found`);
    }

    return debris;
  }

  async update(id: string, updateDebrisDto: UpdateDebrisDto): Promise<Debris> {
    const debris = await this.findOne(id);
    
    // Check if catalog_id is being updated and if it's already taken
    if (updateDebrisDto.catalog_id && updateDebrisDto.catalog_id !== debris.catalog_id) {
      const existingDebris = await this.debrisRepository.findOne({
        where: { catalog_id: updateDebrisDto.catalog_id },
      });

      if (existingDebris) {
        throw new ConflictException('Catalog ID already in use');
      }
    }

    Object.assign(debris, updateDebrisDto);
    return await this.debrisRepository.save(debris);
  }

  async remove(id: string): Promise<void> {
    const debris = await this.findOne(id);
    await this.debrisRepository.remove(debris);
  }

  async findByRiskScore(minRiskScore: number): Promise<Debris[]> {
    return await this.debrisRepository
      .createQueryBuilder('debris')
      .where('debris.risk_score >= :minRiskScore', { minRiskScore })
      .orderBy('debris.risk_score', 'DESC')
      .getMany();
  }

  async findByLocation(lat: number, lon: number, radius: number): Promise<Debris[]> {
    return await this.debrisRepository
      .createQueryBuilder('debris')
      .where(
        `ST_DWithin(
          ST_Point(debris.lon, debris.lat)::geography,
          ST_Point(:lon, :lat)::geography,
          :radius
        )`,
        { lat, lon, radius }
      )
      .getMany();
  }
}
