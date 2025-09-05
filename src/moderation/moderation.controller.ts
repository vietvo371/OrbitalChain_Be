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
} from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { CreateModerationDto } from './dto/create-moderation.dto';
import { UpdateModerationDto } from './dto/update-moderation.dto';
import { ModerationResponseDto } from './dto/moderation-response.dto';

@Controller('moderations')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createModerationDto: CreateModerationDto): Promise<ModerationResponseDto> {
    return await this.moderationService.create(createModerationDto);
  }

  @Get()
  async findAll(): Promise<ModerationResponseDto[]> {
    return await this.moderationService.findAll();
  }

  @Get('moderator/:moderatorId')
  async findByModerator(@Param('moderatorId') moderatorId: string): Promise<ModerationResponseDto[]> {
    return await this.moderationService.findByModerator(moderatorId);
  }

  @Get('observation/:observationId')
  async findByObservation(@Param('observationId') observationId: string): Promise<ModerationResponseDto> {
    return await this.moderationService.findByObservation(observationId);
  }

  @Get('stats')
  async getStats(): Promise<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  }> {
    return await this.moderationService.getModerationStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ModerationResponseDto> {
    return await this.moderationService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateModerationDto: UpdateModerationDto,
  ): Promise<ModerationResponseDto> {
    return await this.moderationService.update(id, updateModerationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.moderationService.remove(id);
  }
}
