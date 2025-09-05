import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Observation } from '../observation/observation.entity';
import { Moderation } from '../moderation/moderation.entity';

export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 42 })
  wallet_address: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ nullable: true })
  avatar_url?: string;

  @CreateDateColumn()
  joined_at: Date;

  // Relations
  @OneToMany(() => Observation, (observation) => observation.user)
  observations: Observation[];

  @OneToMany(() => Moderation, (moderation) => moderation.moderator)
  moderations: Moderation[];
}
