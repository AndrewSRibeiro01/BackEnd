import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Crop } from '../../../domain/entities/crop.entity';
import { CropRepository } from '../../../domain/repositories/crop.repository';
import { CropOrmEntity } from '../entities/crop.orm-entity';
import { CropMapper } from '../mappers/crop.mapper';

@Injectable()
export class CropTypeOrmRepository implements CropRepository {
  constructor(
    @InjectRepository(CropOrmEntity)
    private readonly repo: Repository<CropOrmEntity>,
  ) {}

  async create(crop: Crop): Promise<Crop> {
    const saved = await this.repo.save(CropMapper.toOrm(crop));
    return CropMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async findById(id: string): Promise<Crop | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? CropMapper.toDomain(orm) : null;
  }

  async findByHarvestAndName(
    harvestId: string,
    name: string,
  ): Promise<Crop | null> {
    const orm = await this.repo.findOne({ where: { harvestId, name } });
    return orm ? CropMapper.toDomain(orm) : null;
  }

  async findByHarvestId(harvestId: string): Promise<Crop[]> {
    const orms = await this.repo.find({
      where: { harvestId },
      order: { name: 'ASC' },
    });
    return orms.map(CropMapper.toDomain);
  }

  async findAll(): Promise<Crop[]> {
    const orms = await this.repo.find({ order: { createdAt: 'DESC' } });
    return orms.map(CropMapper.toDomain);
  }
}
