import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Observation } from '../observation/observation.entity';
import { BlockchainLog } from '../blockchain_log/blockchain_log.entity';

@Entity('debris')
export class Debris {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  catalog_id: string;

  @Column()
  source: string;

  @Column({ type: 'timestamp' })
  epoch: Date;

  @Column({ type: 'text' })
  tle_line1: string;

  @Column({ type: 'text' })
  tle_line2: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lon: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  alt: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  risk_score: number;

  @Column({ nullable: true })
  on_chain_tx?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Observation, (observation) => observation.debris)
  observations: Observation[];

  @OneToMany(() => BlockchainLog, (blockchainLog) => blockchainLog.debris)
  blockchain_logs: BlockchainLog[];
}
