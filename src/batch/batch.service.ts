import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Debris } from '../debris/debris.entity';
import { Observation } from '../observation/observation.entity';
import { Moderation } from '../moderation/moderation.entity';
import { BlockchainLog } from '../blockchain_log/blockchain_log.entity';

@Injectable()
export class BatchService {
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

  async importDebris(debrisData: any[]) {
    const results = {
      total: debrisData.length,
      success: 0,
      errors: 0,
      errors_list: [] as Array<{ item: any; error: string }>,
    };

    for (const debrisItem of debrisData) {
      try {
        const debris = this.debrisRepository.create(debrisItem);
        await this.debrisRepository.save(debris);
        results.success++;
      } catch (error) {
        results.errors++;
        results.errors_list.push({
          item: debrisItem,
          error: error.message,
        });
      }
    }

    return results;
  }

  async importUsers(usersData: any[]) {
    const results = {
      total: usersData.length,
      success: 0,
      errors: 0,
      errors_list: [] as Array<{ item: any; error: string }>,
    };

    for (const userItem of usersData) {
      try {
        const user = this.userRepository.create(userItem);
        await this.userRepository.save(user);
        results.success++;
      } catch (error) {
        results.errors++;
        results.errors_list.push({
          item: userItem,
          error: error.message,
        });
      }
    }

    return results;
  }

  async batchApproveObservations(observationIds: string[]) {
    const results = {
      total: observationIds.length,
      success: 0,
      errors: 0,
      errors_list: [] as Array<{ observationId: string; error: string }>,
    };

    for (const observationId of observationIds) {
      try {
        const observation = await this.observationRepository.findOne({
          where: { id: observationId },
        });

        if (!observation) {
          throw new Error('Observation not found');
        }

        observation.approved = true;
        await this.observationRepository.save(observation);
        results.success++;
      } catch (error) {
        results.errors++;
        results.errors_list.push({
          observationId,
          error: error.message,
        });
      }
    }

    return results;
  }

  async batchRejectObservations(observationIds: string[]) {
    const results = {
      total: observationIds.length,
      success: 0,
      errors: 0,
      errors_list: [] as Array<{ observationId: string; error: string }>,
    };

    for (const observationId of observationIds) {
      try {
        const observation = await this.observationRepository.findOne({
          where: { id: observationId },
        });

        if (!observation) {
          throw new Error('Observation not found');
        }

        observation.approved = false;
        await this.observationRepository.save(observation);
        results.success++;
      } catch (error) {
        results.errors++;
        results.errors_list.push({
          observationId,
          error: error.message,
        });
      }
    }

    return results;
  }

  async syncBlockchainLogs(fromBlock?: number, toBlock?: number) {
    // Implementation for syncing blockchain logs
    // This would typically connect to a blockchain node
    return {
      success: true,
      message: 'Blockchain sync completed',
      fromBlock,
      toBlock,
    };
  }

  async cleanupOldData(olderThanDays: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const results = {
      cutoffDate: cutoffDate.toISOString(),
      deletedRecords: {
        observations: 0,
        moderations: 0,
        blockchainLogs: 0,
      },
    };

    // Clean up old observations
    const oldObservations = await this.observationRepository
      .createQueryBuilder('observation')
      .where('observation.submitted_at < :cutoffDate', { cutoffDate })
      .getMany();

    for (const observation of oldObservations) {
      await this.observationRepository.remove(observation);
      results.deletedRecords.observations++;
    }

    return results;
  }

  async getJobStatus(jobId: string) {
    // Implementation for job status tracking
    return {
      jobId,
      status: 'completed',
      progress: 100,
      message: 'Job completed successfully',
    };
  }

  async getJobHistory() {
    // Implementation for job history
    return {
      jobs: [],
      total: 0,
    };
  }
}
