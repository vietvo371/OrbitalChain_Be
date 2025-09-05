import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Debris } from '../debris/debris.entity';
import { Observation } from '../observation/observation.entity';
import { User } from '../user/user.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Debris)
    private debrisRepository: Repository<Debris>,
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async searchDebris(query: string, page: number, limit: number, filters?: string) {
    const queryBuilder = this.debrisRepository.createQueryBuilder('debris');
    
    // Text search
    if (query) {
      queryBuilder.andWhere(
        '(debris.catalog_id ILIKE :query OR debris.source ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    // Apply filters
    if (filters) {
      const filterObj = JSON.parse(filters);
      
      if (filterObj.riskScore) {
        const { min, max } = filterObj.riskScore;
        queryBuilder.andWhere('debris.risk_score BETWEEN :minRisk AND :maxRisk', {
          minRisk: min || 0,
          maxRisk: max || 10,
        });
      }

      if (filterObj.source) {
        queryBuilder.andWhere('debris.source = :source', { source: filterObj.source });
      }

      if (filterObj.altitude) {
        const { min, max } = filterObj.altitude;
        queryBuilder.andWhere('debris.alt BETWEEN :minAlt AND :maxAlt', {
          minAlt: min || 0,
          maxAlt: max || 10000,
        });
      }

      if (filterObj.dateRange) {
        const { start, end } = filterObj.dateRange;
        queryBuilder.andWhere('debris.created_at BETWEEN :startDate AND :endDate', {
          startDate: start,
          endDate: end,
        });
      }
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by relevance (risk score for now)
    queryBuilder.orderBy('debris.risk_score', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchObservations(query: string, page: number, limit: number, filters?: string) {
    const queryBuilder = this.observationRepository
      .createQueryBuilder('observation')
      .leftJoinAndSelect('observation.user', 'user')
      .leftJoinAndSelect('observation.debris', 'debris');

    // Text search
    if (query) {
      queryBuilder.andWhere(
        '(observation.note ILIKE :query OR user.email ILIKE :query OR debris.catalog_id ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    // Apply filters
    if (filters) {
      const filterObj = JSON.parse(filters);
      
      if (filterObj.status !== undefined) {
        queryBuilder.andWhere('observation.approved = :status', { 
          status: filterObj.status === 'approved' ? true : filterObj.status === 'rejected' ? false : null 
        });
      }

      if (filterObj.userId) {
        queryBuilder.andWhere('observation.user_id = :userId', { userId: filterObj.userId });
      }

      if (filterObj.debrisId) {
        queryBuilder.andWhere('observation.debris_id = :debrisId', { debrisId: filterObj.debrisId });
      }

      if (filterObj.dateRange) {
        const { start, end } = filterObj.dateRange;
        queryBuilder.andWhere('observation.submitted_at BETWEEN :startDate AND :endDate', {
          startDate: start,
          endDate: end,
        });
      }
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by submission date
    queryBuilder.orderBy('observation.submitted_at', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchUsers(query: string, page: number, limit: number) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    // Text search
    if (query) {
      queryBuilder.andWhere(
        '(user.email ILIKE :query OR user.wallet_address ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by points
    queryBuilder.orderBy('user.points', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items: items.map(user => ({
        id: user.id,
        email: user.email,
        wallet_address: user.wallet_address,
        role: user.role,
        points: user.points,
        joined_at: user.joined_at,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchGeospatial(bounds: string, type: string, page: number, limit: number) {
    const [lat1, lng1, lat2, lng2] = bounds.split(',').map(Number);
    
    if (type === 'debris') {
      return this.searchDebrisInBounds(lat1, lng1, lat2, lng2, page, limit);
    } else if (type === 'observations') {
      return this.searchObservationsInBounds(lat1, lng1, lat2, lng2, page, limit);
    }
    
    return { items: [], total: 0, page, limit, totalPages: 0 };
  }

  async getSearchSuggestions(query: string, type: string) {
    if (!query || query.length < 2) {
      return [];
    }

    switch (type) {
      case 'debris':
        return this.getDebrisSuggestions(query);
      case 'observations':
        return this.getObservationSuggestions(query);
      case 'users':
        return this.getUserSuggestions(query);
      default:
        return [];
    }
  }

  private async searchDebrisInBounds(lat1: number, lng1: number, lat2: number, lng2: number, page: number, limit: number) {
    const queryBuilder = this.debrisRepository
      .createQueryBuilder('debris')
      .where('debris.lat BETWEEN :lat1 AND :lat2', { lat1, lat2 })
      .andWhere('debris.lon BETWEEN :lng1 AND :lng2', { lng1, lng2 });

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('debris.risk_score', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async searchObservationsInBounds(lat1: number, lng1: number, lat2: number, lng2: number, page: number, limit: number) {
    const queryBuilder = this.observationRepository
      .createQueryBuilder('observation')
      .leftJoinAndSelect('observation.user', 'user')
      .leftJoinAndSelect('observation.debris', 'debris')
      .where('observation.location_lat BETWEEN :lat1 AND :lat2', { lat1, lat2 })
      .andWhere('observation.location_lon BETWEEN :lng1 AND :lng2', { lng1, lng2 });

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('observation.submitted_at', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async getDebrisSuggestions(query: string) {
    const suggestions = await this.debrisRepository
      .createQueryBuilder('debris')
      .select('debris.catalog_id', 'catalog_id')
      .addSelect('debris.source', 'source')
      .where('debris.catalog_id ILIKE :query', { query: `%${query}%` })
      .orWhere('debris.source ILIKE :query', { query: `%${query}%` })
      .limit(5)
      .getRawMany();

    return suggestions.map(item => ({
      type: 'debris',
      value: item.catalog_id,
      label: `${item.catalog_id} (${item.source})`,
    }));
  }

  private async getObservationSuggestions(query: string) {
    const suggestions = await this.observationRepository
      .createQueryBuilder('observation')
      .leftJoin('observation.user', 'user')
      .select('observation.note', 'note')
      .addSelect('user.email', 'user_email')
      .where('observation.note ILIKE :query', { query: `%${query}%` })
      .limit(5)
      .getRawMany();

    return suggestions.map(item => ({
      type: 'observation',
      value: item.note,
      label: `${item.note.substring(0, 50)}... (${item.user_email})`,
    }));
  }

  private async getUserSuggestions(query: string) {
    const suggestions = await this.userRepository
      .createQueryBuilder('user')
      .select('user.email', 'email')
      .addSelect('user.wallet_address', 'wallet_address')
      .where('user.email ILIKE :query', { query: `%${query}%` })
      .orWhere('user.wallet_address ILIKE :query', { query: `%${query}%` })
      .limit(5)
      .getRawMany();

    return suggestions.map(item => ({
      type: 'user',
      value: item.email,
      label: `${item.email} (${item.wallet_address})`,
    }));
  }
}
