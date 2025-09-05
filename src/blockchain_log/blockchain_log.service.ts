import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockchainLog } from './blockchain_log.entity';
import { CreateBlockchainLogDto } from './dto/create-blockchain-log.dto';
import { UpdateBlockchainLogDto } from './dto/update-blockchain-log.dto';

@Injectable()
export class BlockchainLogService {
  constructor(
    @InjectRepository(BlockchainLog)
    private readonly blockchainLogRepository: Repository<BlockchainLog>,
  ) {}

  async create(createBlockchainLogDto: CreateBlockchainLogDto): Promise<BlockchainLog> {
    const blockchainLog = this.blockchainLogRepository.create(createBlockchainLogDto);
    return await this.blockchainLogRepository.save(blockchainLog);
  }

  async findAll(): Promise<BlockchainLog[]> {
    return await this.blockchainLogRepository.find({
      relations: ['debris'],
    });
  }

  async findOne(id: string): Promise<BlockchainLog> {
    const blockchainLog = await this.blockchainLogRepository.findOne({
      where: { id },
      relations: ['debris'],
    });

    if (!blockchainLog) {
      throw new NotFoundException(`Blockchain log with ID ${id} not found`);
    }

    return blockchainLog;
  }

  async findByDebris(debrisId: string): Promise<BlockchainLog[]> {
    return await this.blockchainLogRepository.find({
      where: { debris_id: debrisId },
      relations: ['debris'],
      order: { committed_at: 'DESC' },
    });
  }

  async findByTransactionHash(txHash: string): Promise<BlockchainLog> {
    const blockchainLog = await this.blockchainLogRepository.findOne({
      where: { tx_hash: txHash },
      relations: ['debris'],
    });

    if (!blockchainLog) {
      throw new NotFoundException(`Blockchain log with transaction hash ${txHash} not found`);
    }

    return blockchainLog;
  }

  async findByBlockNumber(blockNumber: number): Promise<BlockchainLog[]> {
    return await this.blockchainLogRepository.find({
      where: { block_number: blockNumber },
      relations: ['debris'],
    });
  }

  async update(id: string, updateBlockchainLogDto: UpdateBlockchainLogDto): Promise<BlockchainLog> {
    const blockchainLog = await this.findOne(id);
    Object.assign(blockchainLog, updateBlockchainLogDto);
    return await this.blockchainLogRepository.save(blockchainLog);
  }

  async remove(id: string): Promise<void> {
    const blockchainLog = await this.findOne(id);
    await this.blockchainLogRepository.remove(blockchainLog);
  }

  async getLatestBlockNumber(): Promise<number> {
    const latestLog = await this.blockchainLogRepository.findOne({
      order: { block_number: 'DESC' },
    });

    return latestLog ? latestLog.block_number : 0;
  }

  async getTransactionStats(): Promise<{
    total: number;
    uniqueDebris: number;
    latestBlock: number;
  }> {
    const [total, uniqueDebris, latestBlock] = await Promise.all([
      this.blockchainLogRepository.count(),
      this.blockchainLogRepository
        .createQueryBuilder('log')
        .select('COUNT(DISTINCT log.debris_id)', 'count')
        .getRawOne()
        .then(result => parseInt(result.count)),
      this.getLatestBlockNumber(),
    ]);

    return {
      total,
      uniqueDebris,
      latestBlock,
    };
  }
}
