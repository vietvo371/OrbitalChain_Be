import { UserRole } from '../user.entity';

export class UserResponseDto {
  id: string;
  wallet_address: string;
  email?: string;
  role: UserRole;
  points: number;
  joined_at: Date;
}
