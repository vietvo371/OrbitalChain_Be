import { UserRole } from '../../user/user.entity';

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    wallet_address: string;
    email: string;
    role: UserRole;
    points: number;
    joined_at: Date;
  };
}
