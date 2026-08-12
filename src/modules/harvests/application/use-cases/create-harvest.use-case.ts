import { Inject, Injectable } from '@nestjs/common';

import {
  ConflictError,
  EntityNotFound,
} from '../../../../shared/exceptions/domain.exception';
import {
  FARM_REPOSITORY,
  FarmRepository,
} from '../../../farms/domain/repositories/farm.repository';
import { Harvest } from '../../domain/entities/harvest.entity';
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from '../../domain/repositories/harvest.repository';

export interface CreateHarvestInput {
  farmId: string;
  year: number;
}

@Injectable()
export class CreateHarvestUseCase {
  constructor(
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepo: HarvestRepository,
    @Inject(FARM_REPOSITORY)
    private readonly farmRepo: FarmRepository,
  ) {}

  async execute(input: CreateHarvestInput): Promise<Harvest> {
    const farm = await this.farmRepo.findById(input.farmId);
    if (!farm) throw new EntityNotFound('Farm', input.farmId);

    const existing = await this.harvestRepo.findByFarmAndYear(
      input.farmId,
      input.year,
    );
    if (existing) {
      throw new ConflictError(
        `Farm ${input.farmId} already has a harvest for year ${input.year}`,
      );
    }

    return this.harvestRepo.create(Harvest.create(input));
  }
}
