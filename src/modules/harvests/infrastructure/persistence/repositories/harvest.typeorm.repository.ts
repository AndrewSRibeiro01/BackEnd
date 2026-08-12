import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Harvest } from '../../../domain/entities/harvest.entity';
import { HarvestRepository } from '../../../domain/repositories/harvest.repository';
import { HarvestOrmEntity } from '../entities/harvest.orm-entity';
import { HarvestMapper } from '../mappers/harvest.mapper';

@Injectable()
export class HarvestTypeOrmRepository implements HarvestRepository {
  constructor(
    @InjectRepository(HarvestOrmEntity)
    private readonly repo: Repository<HarvestOrmEntity>,
  ) {}

  async create(harvest: Harvest): Promise<Harvest> {
    const saved = await this.repo.save(HarvestMapper.toOrm(harvest));
    return HarvestMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async findById(id: string): Promise<Harvest | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? HarvestMapper.toDomain(orm) : null;
  }

  async findByFarmAndYear(
    farmId: string,
    year: number,
  ): Promise<Harvest | null> {
    const orm = await this.repo.findOne({ where: { farmId, year } });
    return orm ? HarvestMapper.toDomain(orm) : null;
  }

  async findByFarmId(farmId: string): Promise<Harvest[]> {
    const orms = await this.repo.find({
      where: { farmId },
      order: { year: 'DESC' },
    });
    return orms.map(HarvestMapper.toDomain);
  }

  async findAll(): Promise<Harvest[]> {
    const orms = await this.repo.find({ order: { year: 'DESC' } });
    return orms.map(HarvestMapper.toDomain);
  }
}
