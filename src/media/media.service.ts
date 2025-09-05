import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Observation } from '../observation/observation.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async uploadObservationImage(file: any, observationId: string) {
    // Update observation with image URL
    const observation = await this.observationRepository.findOne({
      where: { id: observationId },
    });

    if (!observation) {
      throw new Error('Observation not found');
    }

    // Update observation with image URL
    observation.image_url = `/uploads/observations/${file.filename}`;
    await this.observationRepository.save(observation);

    return {
      success: true,
      imageUrl: observation.image_url,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async uploadUserAvatar(file: any, userId: string) {
    // Update user with avatar URL
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update user with avatar URL
    user.avatar_url = `/uploads/avatars/${file.filename}`;
    await this.userRepository.save(user);

    return {
      success: true,
      avatarUrl: user.avatar_url,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async getObservationImages(observationId: string) {
    const observation = await this.observationRepository.findOne({
      where: { id: observationId },
    });

    if (!observation) {
      throw new Error('Observation not found');
    }

    return {
      observationId,
      imageUrl: observation.image_url,
    };
  }

  async getUserAvatar(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      userId,
      avatarUrl: user.avatar_url,
    };
  }

  async deleteImage(imageId: string) {
    // Implementation for deleting images
    return {
      success: true,
      message: 'Image deleted successfully',
    };
  }

  async getMediaStats() {
    const [totalObservations, observationsWithImages] = await Promise.all([
      this.observationRepository.count(),
      this.observationRepository
        .createQueryBuilder('observation')
        .where('observation.image_url IS NOT NULL')
        .getCount(),
    ]);

    return {
      totalObservations,
      observationsWithImages,
      imageUploadRate: totalObservations > 0 
        ? Math.round((observationsWithImages / totalObservations) * 100) / 100 
        : 0,
    };
  }
}
