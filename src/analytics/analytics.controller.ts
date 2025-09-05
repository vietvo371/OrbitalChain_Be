import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('debris-stats')
  async getDebrisStats(
    @Query('timeframe') timeframe?: string,
    @Query('source') source?: string,
  ) {
    return this.analyticsService.getDebrisStats(timeframe, source);
  }

  @Get('observation-stats')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getObservationStats(
    @Query('timeframe') timeframe?: string,
    @Query('status') status?: string,
  ) {
    return this.analyticsService.getObservationStats(timeframe, status);
  }

  @Get('user-leaderboard')
  async getUserLeaderboard(
    @Query('limit') limit?: number,
    @Query('timeframe') timeframe?: string,
  ) {
    return this.analyticsService.getUserLeaderboard(limit, timeframe);
  }

  @Get('moderation-stats')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getModerationStats(
    @Query('moderatorId') moderatorId?: string,
    @Query('timeframe') timeframe?: string,
  ) {
    return this.analyticsService.getModerationStats(moderatorId, timeframe);
  }

  @Get('blockchain-stats')
  async getBlockchainStats(
    @Query('timeframe') timeframe?: string,
  ) {
    return this.analyticsService.getBlockchainStats(timeframe);
  }

  @Get('risk-analysis')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getRiskAnalysis() {
    return this.analyticsService.getRiskAnalysis();
  }

  @Get('geospatial-stats')
  async getGeospatialStats(
    @Query('bounds') bounds?: string, // "lat1,lng1,lat2,lng2"
  ) {
    return this.analyticsService.getGeospatialStats(bounds);
  }
}
