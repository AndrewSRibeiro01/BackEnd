import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Harvest } from '../../domain/entities/harvest.entity';
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from '../../domain/repositories/harvest.repository';

@Injectable()
export class FindHarvestByIdUseCase {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly repo: HarvestRepository,
  ) {}

  async execute(id: string): Promise<Harvest> {
    const harvest = await this.repo.findById(id);
    if (!harvest) throw new EntityNotFound('Harvest', id);
    return harvest;
  }
}
