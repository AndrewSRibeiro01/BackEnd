import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farm } from '../../../domain/entities/farm.entity';
import { FarmRepository } from '../../../domain/repositories/farm.repository';
import { FarmOrmEntity } from '../entities/farm.orm-entity';
import { FarmMapper } from '../mappers/farm.mapper';

@Injectable()
export class FarmTypeOrmRepository implements FarmRepository {
  constructor(
    @InjectRepository(FarmOrmEntity)
    private readonly repo: Repository<FarmOrmEntity>,
  ) {}

  async create(farm: Farm): Promise<Farm> {
    const saved = await this.repo.save(FarmMapper.toOrm(farm));
    return FarmMapper.toDomain(saved);
  }

  async update(farm: Farm): Promise<Farm> {
    const saved = await this.repo.save(FarmMapper.toOrm(farm));
    return FarmMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async findById(id: string): Promise<Farm | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? FarmMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Farm[]> {
    const orms = await this.repo.find({ order: { createdAt: 'DESC' } });
    return orms.map(FarmMapper.toDomain);
  }

  async findByProducerId(producerId: string): Promise<Farm[]> {
    const orms = await this.repo.find({
      where: { producerId },
      order: { createdAt: 'DESC' },
    });
    return orms.map(FarmMapper.toDomain);
  }
}
