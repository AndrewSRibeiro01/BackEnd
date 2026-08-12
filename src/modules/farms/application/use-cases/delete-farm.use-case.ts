import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import {
  FARM_REPOSITORY,
  FarmRepository,
} from '../../domain/repositories/farm.repository';

@Injectable()
export class DeleteFarmUseCase {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly repository: FarmRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new EntityNotFound('Farm', id);
    await this.repository.delete(id);
  }
}
