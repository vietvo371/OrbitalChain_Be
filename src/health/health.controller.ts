import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth() {
    return this.healthService.getBasicHealth();
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  async getDetailedHealth() {
    return this.healthService.getDetailedHealth();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  async getReadiness() {
    return this.healthService.getReadiness();
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Service metrics' })
  @ApiResponse({ status: 200, description: 'Service metrics' })
  async getMetrics() {
    return this.healthService.getMetrics();
  }
}
