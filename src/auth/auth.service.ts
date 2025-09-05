import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, wallet_address, role } = registerDto;

    // Check if user already exists
    try {
      await this.userService.findByWalletAddress(wallet_address);
      throw new ConflictException('User with this wallet address already exists');
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // User not found, continue with registration
    }

    // Check if email is already taken
    try {
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Email not found, continue with registration
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userService.create({
      wallet_address,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    const payload = { email: user.email!, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        wallet_address: user.wallet_address,
        email: user.email,
        role: user.role,
        points: user.points,
        joined_at: user.joined_at,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email!, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        wallet_address: user.wallet_address,
        email: user.email,
        role: user.role,
        points: user.points,
        joined_at: user.joined_at,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      if (user && user.password && await bcrypt.compare(password, user.password)) {
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userService.findOne(userId);
    
    if (!user.password) {
      throw new BadRequestException('User does not have a password set');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update user password
    await this.userService.update(userId, { password: hashedNewPassword });
  }

  async resetPassword(email: string): Promise<void> {
    // This would typically send a password reset email
    // For now, we'll just throw an error indicating this feature needs to be implemented
    throw new BadRequestException('Password reset functionality not implemented yet');
  }
}
