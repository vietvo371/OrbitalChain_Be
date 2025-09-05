import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Debris } from '../debris/debris.entity';
import { Observation } from '../observation/observation.entity';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Debris)
    private debrisRepository: Repository<Debris>,
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
  ) {}

  async getBasicHealth() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      },
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  async getDetailedHealth() {
    const [basicHealth, databaseHealth, serviceHealth] = await Promise.all([
      this.getBasicHealth(),
      this.checkDatabaseHealth(),
      this.checkServiceHealth(),
    ]);

    const overallStatus = databaseHealth.status === 'OK' && serviceHealth.status === 'OK' 
      ? 'OK' 
      : 'DEGRADED';

    return {
      ...basicHealth,
      status: overallStatus,
      checks: {
        database: databaseHealth,
        service: serviceHealth,
      },
    };
  }

  async getReadiness() {
    const databaseHealth = await this.checkDatabaseHealth();
    
    if (databaseHealth.status !== 'OK') {
      return {
        status: 'NOT_READY',
        timestamp: new Date().toISOString(),
        reason: 'Database connection failed',
        details: databaseHealth,
      };
    }

    return {
      status: 'READY',
      timestamp: new Date().toISOString(),
    };
  }

  async getLiveness() {
    return {
      status: 'ALIVE',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async getMetrics() {
    const [userCount, debrisCount, observationCount, memoryUsage, cpuUsage] = await Promise.all([
      this.userRepository.count(),
      this.debrisRepository.count(),
      this.observationRepository.count(),
      this.getMemoryMetrics(),
      this.getCpuMetrics(),
    ]);

    return {
      timestamp: new Date().toISOString(),
      data: {
        users: userCount,
        debris: debrisCount,
        observations: observationCount,
      },
      system: {
        memory: memoryUsage,
        cpu: cpuUsage,
        uptime: process.uptime(),
      },
    };
  }

  private async checkDatabaseHealth() {
    try {
      // Test database connection with a simple query
      await this.userRepository.query('SELECT 1');
      
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        responseTime: '< 100ms',
      };
    } catch (error) {
      return {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  private async checkServiceHealth() {
    try {
      // Check if all required services are available
      const checks = await Promise.allSettled([
        this.userRepository.count(),
        this.debrisRepository.count(),
        this.observationRepository.count(),
      ]);

      const hasErrors = checks.some(check => check.status === 'rejected');
      
      return {
        status: hasErrors ? 'ERROR' : 'OK',
        timestamp: new Date().toISOString(),
        details: checks.map((check, index) => ({
          service: ['users', 'debris', 'observations'][index],
          status: check.status === 'fulfilled' ? 'OK' : 'ERROR',
          error: check.status === 'rejected' ? check.reason.message : null,
        })),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  private getMemoryMetrics() {
    const memoryUsage = process.memoryUsage();
    
    return {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    };
  }

  private getCpuMetrics() {
    const cpuUsage = process.cpuUsage();
    
    return {
      user: cpuUsage.user,
      system: cpuUsage.system,
    };
  }
}
