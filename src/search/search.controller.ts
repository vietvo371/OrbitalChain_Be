import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('debris')
  async searchDebris(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('filters') filters?: string,
  ) {
    return this.searchService.searchDebris(query, page, limit, filters);
  }

  @Get('observations')
  async searchObservations(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('filters') filters?: string,
  ) {
    return this.searchService.searchObservations(query, page, limit, filters);
  }

  @Get('users')
  async searchUsers(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.searchService.searchUsers(query, page, limit);
  }

  @Get('geospatial')
  async searchGeospatial(
    @Query('bounds') bounds: string, // "lat1,lng1,lat2,lng2"
    @Query('type') type: 'debris' | 'observations' = 'debris',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.searchService.searchGeospatial(bounds, type, page, limit);
  }

  @Get('suggestions')
  async getSearchSuggestions(
    @Query('q') query: string,
    @Query('type') type: 'debris' | 'observations' | 'users' = 'debris',
  ) {
    return this.searchService.getSearchSuggestions(query, type);
  }
}
