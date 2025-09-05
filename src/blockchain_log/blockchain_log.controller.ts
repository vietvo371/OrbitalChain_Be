import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { BlockchainLogService } from './blockchain_log.service';
import { CreateBlockchainLogDto } from './dto/create-blockchain-log.dto';
import { UpdateBlockchainLogDto } from './dto/update-blockchain-log.dto';
import { BlockchainLogResponseDto } from './dto/blockchain-log-response.dto';

@Controller('blockchain-logs')
export class BlockchainLogController {
  constructor(private readonly blockchainLogService: BlockchainLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createBlockchainLogDto: CreateBlockchainLogDto): Promise<BlockchainLogResponseDto> {
    return await this.blockchainLogService.create(createBlockchainLogDto);
  }

  @Get()
  async findAll(): Promise<BlockchainLogResponseDto[]> {
    return await this.blockchainLogService.findAll();
  }

  @Get('debris/:debrisId')
  async findByDebris(@Param('debrisId') debrisId: string): Promise<BlockchainLogResponseDto[]> {
    return await this.blockchainLogService.findByDebris(debrisId);
  }

  @Get('transaction/:txHash')
  async findByTransactionHash(@Param('txHash') txHash: string): Promise<BlockchainLogResponseDto> {
    return await this.blockchainLogService.findByTransactionHash(txHash);
  }

  @Get('block/:blockNumber')
  async findByBlockNumber(@Param('blockNumber') blockNumber: number): Promise<BlockchainLogResponseDto[]> {
    return await this.blockchainLogService.findByBlockNumber(blockNumber);
  }

  @Get('stats')
  async getStats(): Promise<{
    total: number;
    uniqueDebris: number;
    latestBlock: number;
  }> {
    return await this.blockchainLogService.getTransactionStats();
  }

  @Get('latest-block')
  async getLatestBlockNumber(): Promise<{ latestBlock: number }> {
    const latestBlock = await this.blockchainLogService.getLatestBlockNumber();
    return { latestBlock };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlockchainLogResponseDto> {
    return await this.blockchainLogService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBlockchainLogDto: UpdateBlockchainLogDto,
  ): Promise<BlockchainLogResponseDto> {
    return await this.blockchainLogService.update(id, updateBlockchainLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.blockchainLogService.remove(id);
  }
}
