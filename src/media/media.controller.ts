import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { multerConfig } from './multer.config';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload/observation')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadObservationImage(
    @UploadedFile() file: any,
    @Body('observationId') observationId: string,
  ) {
    return this.mediaService.uploadObservationImage(file, observationId);
  }

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async uploadUserAvatar(
    @UploadedFile() file: any,
    @Body('userId') userId: string,
  ) {
    return this.mediaService.uploadUserAvatar(file, userId);
  }

  @Get('observation/:observationId/images')
  async getObservationImages(@Param('observationId') observationId: string) {
    return this.mediaService.getObservationImages(observationId);
  }

  @Get('user/:userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    return this.mediaService.getUserAvatar(userId);
  }

  @Delete('image/:imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    return this.mediaService.deleteImage(imageId);
  }

  @Get('stats')
  async getMediaStats() {
    return this.mediaService.getMediaStats();
  }
}
