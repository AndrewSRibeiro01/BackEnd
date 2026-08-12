import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from '../../domain/repositories/harvest.repository';

@Injectable()
export class DeleteHarvestUseCase {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly repo: HarvestRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new EntityNotFound('Harvest', id);
    await this.repo.delete(id);
  }
}
