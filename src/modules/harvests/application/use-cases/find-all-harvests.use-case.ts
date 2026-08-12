import { Inject, Injectable } from '@nestjs/common';

import { Harvest } from '../../domain/entities/harvest.entity';
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from '../../domain/repositories/harvest.repository';

@Injectable()
export class FindAllHarvestsUseCase {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly repo: HarvestRepository,
  ) {}

  execute(farmId?: string): Promise<Harvest[]> {
    return farmId ? this.repo.findByFarmId(farmId) : this.repo.findAll();
  }
}
