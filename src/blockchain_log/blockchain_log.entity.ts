import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Debris } from '../debris/debris.entity';

@Entity('blockchain_logs')
export class BlockchainLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  debris_id: string;

  @Column()
  tx_hash: string;

  @Column({ type: 'bigint' })
  block_number: number;

  @CreateDateColumn()
  committed_at: Date;

  // Relations
  @ManyToOne(() => Debris, (debris) => debris.blockchain_logs)
  @JoinColumn({ name: 'debris_id' })
  debris: Debris;
}
