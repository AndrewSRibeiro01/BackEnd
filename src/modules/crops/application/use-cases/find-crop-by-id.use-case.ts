import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Crop } from '../../domain/entities/crop.entity';
import {
  CROP_REPOSITORY,
  CropRepository,
} from '../../domain/repositories/crop.repository';

@Injectable()
export class FindCropByIdUseCase {
  constructor(
    @Inject(CROP_REPOSITORY)
    private readonly repo: CropRepository,
  ) {}

  async execute(id: string): Promise<Crop> {
    const crop = await this.repo.findById(id);
    if (!crop) throw new EntityNotFound('Crop', id);
    return crop;
  }
}
