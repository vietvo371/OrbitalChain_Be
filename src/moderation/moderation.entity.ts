import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Observation } from '../observation/observation.entity';

@Entity('moderations')
export class Moderation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  observation_id: string;

  @Column('uuid')
  moderator_id: string;

  @Column({ type: 'boolean' })
  approved: boolean;

  @CreateDateColumn()
  approved_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.moderations)
  @JoinColumn({ name: 'moderator_id' })
  moderator: User;

  @OneToOne(() => Observation, (observation) => observation.moderation)
  @JoinColumn({ name: 'observation_id' })
  observation: Observation;
}
