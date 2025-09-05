import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Debris } from '../debris/debris.entity';
import { Moderation } from '../moderation/moderation.entity';

@Entity('observations')
export class Observation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  debris_id: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  location_lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  location_lon: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  location_alt: number;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @CreateDateColumn()
  submitted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  tx_hash?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.observations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Debris, (debris) => debris.observations)
  @JoinColumn({ name: 'debris_id' })
  debris: Debris;

  @OneToOne(() => Moderation, (moderation) => moderation.observation)
  moderation: Moderation;
}
