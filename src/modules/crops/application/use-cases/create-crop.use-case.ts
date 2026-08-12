import { Inject, Injectable } from '@nestjs/common';

import {
  ConflictError,
  EntityNotFound,
} from '../../../../shared/exceptions/domain.exception';
import {
  HARVEST_REPOSITORY,
  HarvestRepository,
} from '../../../harvests/domain/repositories/harvest.repository';
import { Crop } from '../../domain/entities/crop.entity';
import {
  CROP_REPOSITORY,
  CropRepository,
} from '../../domain/repositories/crop.repository';

export interface CreateCropInput {
  harvestId: string;
  name: string;
}

@Injectable()
export class CreateCropUseCase {
  constructor(
    @Inject(CROP_REPOSITORY)
    private readonly cropRepo: CropRepository,
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepo: HarvestRepository,
  ) {}

  async execute(input: CreateCropInput): Promise<Crop> {
    const harvest = await this.harvestRepo.findById(input.harvestId);
    if (!harvest) throw new EntityNotFound('Harvest', input.harvestId);

    const crop = Crop.create(input);
    const existing = await this.cropRepo.findByHarvestAndName(
      crop.harvestId,
      crop.name,
    );
    if (existing) {
      throw new ConflictError(
        `Harvest ${crop.harvestId} already has crop "${crop.name}"`,
      );
    }

    return this.cropRepo.create(crop);
  }
}
