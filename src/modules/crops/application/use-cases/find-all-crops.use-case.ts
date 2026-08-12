import { Inject, Injectable } from '@nestjs/common';

import { Crop } from '../../domain/entities/crop.entity';
import {
  CROP_REPOSITORY,
  CropRepository,
} from '../../domain/repositories/crop.repository';

@Injectable()
export class FindAllCropsUseCase {
  constructor(
    @Inject(CROP_REPOSITORY)
    private readonly repo: CropRepository,
  ) {}

  execute(harvestId?: string): Promise<Crop[]> {
    return harvestId
      ? this.repo.findByHarvestId(harvestId)
      : this.repo.findAll();
  }
}
