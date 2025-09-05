import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { BatchService } from './batch.service';

@Controller('batch')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post('debris/import')
  @Roles(UserRole.ADMIN)
  async importDebris(@Body() data: { debris: any[] }) {
    return this.batchService.importDebris(data.debris);
  }

  @Post('users/import')
  @Roles(UserRole.ADMIN)
  async importUsers(@Body() data: { users: any[] }) {
    return this.batchService.importUsers(data.users);
  }

  @Post('observations/approve')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async batchApproveObservations(@Body() data: { observationIds: string[] }) {
    return this.batchService.batchApproveObservations(data.observationIds);
  }

  @Post('observations/reject')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async batchRejectObservations(@Body() data: { observationIds: string[] }) {
    return this.batchService.batchRejectObservations(data.observationIds);
  }

  @Post('blockchain/sync')
  @Roles(UserRole.ADMIN)
  async syncBlockchainLogs(@Body() data: { fromBlock?: number; toBlock?: number }) {
    return this.batchService.syncBlockchainLogs(data.fromBlock, data.toBlock);
  }

  @Post('cleanup/old-data')
  @Roles(UserRole.ADMIN)
  async cleanupOldData(@Body() data: { olderThanDays: number }) {
    return this.batchService.cleanupOldData(data.olderThanDays);
  }

  @Get('jobs/status/:jobId')
  @Roles(UserRole.ADMIN)
  async getJobStatus(@Body() data: { jobId: string }) {
    return this.batchService.getJobStatus(data.jobId);
  }

  @Get('jobs/history')
  @Roles(UserRole.ADMIN)
  async getJobHistory() {
    return this.batchService.getJobHistory();
  }
}
