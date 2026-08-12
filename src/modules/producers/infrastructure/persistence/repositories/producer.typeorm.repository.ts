import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Producer } from '../../../domain/entities/producer.entity';
import { ProducerRepository } from '../../../domain/repositories/producer.repository';
import { ProducerOrmEntity } from '../entities/producer.orm-entity';
import { ProducerMapper } from '../mappers/producer.mapper';

@Injectable()
export class ProducerTypeOrmRepository implements ProducerRepository {
  constructor(
    @InjectRepository(ProducerOrmEntity)
    private readonly repo: Repository<ProducerOrmEntity>,
  ) {}

  async create(producer: Producer): Promise<Producer> {
    const saved = await this.repo.save(ProducerMapper.toOrm(producer));
    return ProducerMapper.toDomain(saved);
  }

  async update(producer: Producer): Promise<Producer> {
    const saved = await this.repo.save(ProducerMapper.toOrm(producer));
    return ProducerMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async findById(id: string): Promise<Producer | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? ProducerMapper.toDomain(orm) : null;
  }

  async findByDocument(document: string): Promise<Producer | null> {
    const orm = await this.repo.findOne({ where: { document } });
    return orm ? ProducerMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Producer[]> {
    const orms = await this.repo.find({ order: { createdAt: 'DESC' } });
    return orms.map(ProducerMapper.toDomain);
  }
}
