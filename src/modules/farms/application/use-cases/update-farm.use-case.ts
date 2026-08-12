import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Farm } from '../../domain/entities/farm.entity';
import {
  FARM_REPOSITORY,
  FarmRepository,
} from '../../domain/repositories/farm.repository';

export interface UpdateFarmInput {
  name?: string;
  city?: string;
  state?: string;
  totalHa?: number;
  arableHa?: number;
  vegetationHa?: number;
}

@Injectable()
export class UpdateFarmUseCase {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly repository: FarmRepository,
  ) {}

  async execute(id: string, input: UpdateFarmInput): Promise<Farm> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new EntityNotFound('Farm', id);

    const updated = existing.update(input);
    return this.repository.update(updated);
  }
}
