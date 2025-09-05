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
import { ObservationService } from './observation.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { ObservationResponseDto } from './dto/observation-response.dto';

@Controller('observations')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createObservationDto: CreateObservationDto): Promise<ObservationResponseDto> {
    return await this.observationService.create(createObservationDto);
  }

  @Get()
  async findAll(): Promise<ObservationResponseDto[]> {
    return await this.observationService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<ObservationResponseDto[]> {
    return await this.observationService.findByUser(userId);
  }

  @Get('debris/:debrisId')
  async findByDebris(@Param('debrisId') debrisId: string): Promise<ObservationResponseDto[]> {
    return await this.observationService.findByDebris(debrisId);
  }

  @Get('pending')
  async findPendingApproval(): Promise<ObservationResponseDto[]> {
    return await this.observationService.findPendingApproval();
  }

  @Get('approved')
  async findApproved(): Promise<ObservationResponseDto[]> {
    return await this.observationService.findApproved();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ObservationResponseDto> {
    return await this.observationService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateObservationDto: UpdateObservationDto,
  ): Promise<ObservationResponseDto> {
    return await this.observationService.update(id, updateObservationDto);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(@Param('id') id: string): Promise<ObservationResponseDto> {
    return await this.observationService.approve(id);
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(@Param('id') id: string): Promise<ObservationResponseDto> {
    return await this.observationService.reject(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.observationService.remove(id);
  }
}
