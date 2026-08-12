import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import {
  CROP_REPOSITORY,
  CropRepository,
} from '../../domain/repositories/crop.repository';

@Injectable()
export class DeleteCropUseCase {
  constructor(
    @Inject(CROP_REPOSITORY)
    private readonly repo: CropRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new EntityNotFound('Crop', id);
    await this.repo.delete(id);
  }
}
