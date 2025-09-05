import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding users...');

    const users = [
      {
        wallet_address: '0x1234567890123456789012345678901234567890',
        email: 'admin@orbitalchain.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        points: 1000,
      },
      {
        wallet_address: '0x2345678901234567890123456789012345678901',
        email: 'moderator@orbitalchain.com',
        password: 'moderator123',
        role: UserRole.MODERATOR,
        points: 500,
      },
      {
        wallet_address: '0x3456789012345678901234567890123456789012',
        email: 'user1@orbitalchain.com',
        password: 'user123',
        role: UserRole.USER,
        points: 100,
      },
      {
        wallet_address: '0x4567890123456789012345678901234567890123',
        email: 'user2@orbitalchain.com',
        password: 'user123',
        role: UserRole.USER,
        points: 50,
      },
      {
        wallet_address: '0x5678901234567890123456789012345678901234',
        email: 'researcher@orbitalchain.com',
        password: 'researcher123',
        role: UserRole.USER,
        points: 200,
      },
      {
        wallet_address: '0x6789012345678901234567890123456789012345',
        email: 'observer@orbitalchain.com',
        password: 'observer123',
        role: UserRole.USER,
        points: 75,
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: { wallet_address: userData.wallet_address },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
          ...userData,
          password: hashedPassword,
        });
        await this.userRepository.save(user);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    console.log('✅ Users seeded successfully!');
  }
}
