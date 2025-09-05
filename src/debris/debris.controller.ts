import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { DebrisService } from './debris.service';
import { CreateDebrisDto } from './dto/create-debris.dto';
import { UpdateDebrisDto } from './dto/update-debris.dto';
import { DebrisResponseDto } from './dto/debris-response.dto';

@Controller('debris')
export class DebrisController {
  constructor(private readonly debrisService: DebrisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createDebrisDto: CreateDebrisDto): Promise<DebrisResponseDto> {
    return await this.debrisService.create(createDebrisDto);
  }

  @Get()
  async findAll(): Promise<DebrisResponseDto[]> {
    return await this.debrisService.findAll();
  }

  @Get('catalog/:catalogId')
  async findByCatalogId(@Param('catalogId') catalogId: string): Promise<DebrisResponseDto> {
    return await this.debrisService.findByCatalogId(catalogId);
  }

  @Get('risk')
  async findByRiskScore(@Query('minRiskScore') minRiskScore: number): Promise<DebrisResponseDto[]> {
    return await this.debrisService.findByRiskScore(minRiskScore);
  }

  @Get('location')
  async findByLocation(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
  ): Promise<DebrisResponseDto[]> {
    return await this.debrisService.findByLocation(lat, lon, radius);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DebrisResponseDto> {
    return await this.debrisService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDebrisDto: UpdateDebrisDto,
  ): Promise<DebrisResponseDto> {
    return await this.debrisService.update(id, updateDebrisDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.debrisService.remove(id);
  }
}
