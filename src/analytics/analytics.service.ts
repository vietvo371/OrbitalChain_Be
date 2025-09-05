import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Debris } from '../debris/debris.entity';
import { Observation } from '../observation/observation.entity';
import { Moderation } from '../moderation/moderation.entity';
import { BlockchainLog } from '../blockchain_log/blockchain_log.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Debris)
    private debrisRepository: Repository<Debris>,
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    @InjectRepository(Moderation)
    private moderationRepository: Repository<Moderation>,
    @InjectRepository(BlockchainLog)
    private blockchainLogRepository: Repository<BlockchainLog>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalDebris,
      totalObservations,
      pendingObservations,
      approvedObservations,
      totalModerations,
      latestBlockchainLog,
    ] = await Promise.all([
      this.userRepository.count(),
      this.debrisRepository.count(),
      this.observationRepository.count(),
      this.observationRepository.count({ where: { approved: false } }),
      this.observationRepository.count({ where: { approved: true } }),
      this.moderationRepository.count(),
      this.blockchainLogRepository.findOne({
        order: { block_number: 'DESC' },
      }),
    ]);

    const approvalRate = totalModerations > 0 
      ? (await this.moderationRepository.count({ where: { approved: true } })) / totalModerations 
      : 0;

    return {
      overview: {
        totalUsers,
        totalDebris,
        totalObservations,
        pendingObservations,
        approvedObservations,
        totalModerations,
        approvalRate: Math.round(approvalRate * 100) / 100,
        latestBlockNumber: latestBlockchainLog?.block_number || 0,
      },
      recentActivity: await this.getRecentActivity(),
    };
  }

  async getDebrisStats(timeframe?: string, source?: string) {
    const query = this.debrisRepository.createQueryBuilder('debris');
    
    if (source) {
      query.andWhere('debris.source = :source', { source });
    }

    if (timeframe) {
      const days = this.parseTimeframe(timeframe);
      query.andWhere('debris.created_at >= :date', { 
        date: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
      });
    }

    const [total, avgRiskScore, riskDistribution] = await Promise.all([
      query.getCount(),
      query.select('AVG(debris.risk_score)', 'avgRisk').getRawOne(),
      query
        .select('debris.risk_score', 'riskScore')
        .addSelect('COUNT(*)', 'count')
        .groupBy('debris.risk_score')
        .orderBy('debris.risk_score', 'ASC')
        .getRawMany(),
    ]);

    return {
      total,
      averageRiskScore: parseFloat(avgRiskScore?.avgRisk || '0'),
      riskDistribution: riskDistribution.map(item => ({
        riskScore: parseFloat(item.riskScore),
        count: parseInt(item.count),
      })),
      sourceDistribution: await this.getSourceDistribution(timeframe),
    };
  }

  async getObservationStats(timeframe?: string, status?: string) {
    const query = this.observationRepository.createQueryBuilder('observation');
    
    if (status) {
      query.andWhere('observation.approved = :status', { status: status === 'approved' });
    }

    if (timeframe) {
      const days = this.parseTimeframe(timeframe);
      query.andWhere('observation.submitted_at >= :date', { 
        date: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
      });
    }

    const [total, approved, rejected, pending] = await Promise.all([
      query.getCount(),
      this.observationRepository.count({ where: { approved: true } }),
      this.observationRepository.count({ where: { approved: false } }),
      this.observationRepository
        .createQueryBuilder('observation')
        .where('observation.approved IS NULL')
        .getCount(),
    ]);

    return {
      total,
      approved,
      rejected,
      pending,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) / 100 : 0,
      dailySubmissions: await this.getDailySubmissions(timeframe),
    };
  }

  async getUserLeaderboard(limit = 10, timeframe?: string) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.observations', 'observation')
      .select('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.points', 'points')
      .addSelect('COUNT(observation.id)', 'observationCount')
      .addSelect('COUNT(CASE WHEN observation.approved = true THEN 1 END)', 'approvedObservations')
      .groupBy('user.id, user.email, user.points')
      .orderBy('user.points', 'DESC')
      .limit(limit);

    if (timeframe) {
      const days = this.parseTimeframe(timeframe);
      query.andWhere('observation.submitted_at >= :date', { 
        date: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
      });
    }

    return query.getRawMany();
  }

  async getModerationStats(moderatorId?: string, timeframe?: string) {
    const query = this.moderationRepository.createQueryBuilder('moderation')
      .leftJoin('moderation.moderator', 'moderator')
      .leftJoin('moderation.observation', 'observation');

    if (moderatorId) {
      query.andWhere('moderation.moderator_id = :moderatorId', { moderatorId });
    }

    if (timeframe) {
      const days = this.parseTimeframe(timeframe);
      query.andWhere('moderation.approved_at >= :date', { 
        date: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
      });
    }

    const [total, approved, rejected] = await Promise.all([
      query.getCount(),
      query.clone().andWhere('moderation.approved = true').getCount(),
      query.clone().andWhere('moderation.approved = false').getCount(),
    ]);

    return {
      total,
      approved,
      rejected,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) / 100 : 0,
      averageProcessingTime: await this.getAverageProcessingTime(moderatorId, timeframe),
    };
  }

  async getBlockchainStats(timeframe?: string) {
    const query = this.blockchainLogRepository.createQueryBuilder('log');

    if (timeframe) {
      const days = this.parseTimeframe(timeframe);
      query.andWhere('log.committed_at >= :date', { 
        date: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
      });
    }

    const [total, latestBlock, averageBlockTime] = await Promise.all([
      query.getCount(),
      query.orderBy('log.block_number', 'DESC').getOne(),
      this.calculateAverageBlockTime(timeframe),
    ]);

    return {
      total,
      latestBlockNumber: latestBlock?.block_number || 0,
      averageBlockTime,
      dailyTransactions: await this.getDailyTransactions(timeframe),
    };
  }

  async getRiskAnalysis() {
    const riskAnalysis = await this.debrisRepository
      .createQueryBuilder('debris')
      .select('debris.risk_score', 'riskScore')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(debris.alt)', 'avgAltitude')
      .addSelect('STDDEV(debris.risk_score)', 'riskStdDev')
      .groupBy('debris.risk_score')
      .orderBy('debris.risk_score', 'DESC')
      .getRawMany();

    const highRiskDebris = await this.debrisRepository
      .createQueryBuilder('debris')
      .where('debris.risk_score >= 8')
      .orderBy('debris.risk_score', 'DESC')
      .limit(10)
      .getMany();

    return {
      riskDistribution: riskAnalysis,
      highRiskDebris: highRiskDebris.map(debris => ({
        id: debris.id,
        catalogId: debris.catalog_id,
        riskScore: debris.risk_score,
        altitude: debris.alt,
        source: debris.source,
      })),
      recommendations: this.generateRiskRecommendations(riskAnalysis),
    };
  }

  async getGeospatialStats(bounds?: string) {
    let query = this.debrisRepository.createQueryBuilder('debris');

    if (bounds) {
      const [lat1, lng1, lat2, lng2] = bounds.split(',').map(Number);
      query.andWhere('debris.lat BETWEEN :lat1 AND :lat2', { lat1, lat2 })
           .andWhere('debris.lon BETWEEN :lng1 AND :lng2', { lng1, lng2 });
    }

    const [total, densityMap, altitudeDistribution] = await Promise.all([
      query.getCount(),
      this.getDensityMap(bounds),
      this.getAltitudeDistribution(bounds),
    ]);

    return {
      total,
      densityMap,
      altitudeDistribution,
    };
  }

  private async getRecentActivity() {
    // Implementation for recent activity
    return [];
  }

  private async getSourceDistribution(timeframe?: string) {
    // Implementation for source distribution
    return [];
  }

  private async getDailySubmissions(timeframe?: string) {
    // Implementation for daily submissions
    return [];
  }

  private async getAverageProcessingTime(moderatorId?: string, timeframe?: string) {
    // Implementation for average processing time
    return 0;
  }

  private async calculateAverageBlockTime(timeframe?: string) {
    // Implementation for average block time
    return 0;
  }

  private async getDailyTransactions(timeframe?: string) {
    // Implementation for daily transactions
    return [];
  }

  private async getDensityMap(bounds?: string) {
    // Implementation for density map
    return [];
  }

  private async getAltitudeDistribution(bounds?: string) {
    // Implementation for altitude distribution
    return [];
  }

  private generateRiskRecommendations(riskAnalysis: any[]) {
    const highRiskCount = riskAnalysis.filter(item => parseFloat(item.riskScore) >= 8).length;
    
    if (highRiskCount > 5) {
      return ['High number of high-risk debris detected. Consider immediate monitoring.'];
    }
    
    return ['Risk levels are within acceptable parameters.'];
  }

  private parseTimeframe(timeframe: string): number {
    const timeframes = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };
    return timeframes[timeframe] || 30;
  }
}
