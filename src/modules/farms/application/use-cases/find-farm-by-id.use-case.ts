import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Farm } from '../../domain/entities/farm.entity';
import {
  FARM_REPOSITORY,
  FarmRepository,
} from '../../domain/repositories/farm.repository';

@Injectable()
export class FindFarmByIdUseCase {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly repository: FarmRepository,
  ) {}

  async execute(id: string): Promise<Farm> {
    const farm = await this.repository.findById(id);
    if (!farm) throw new EntityNotFound('Farm', id);
    return farm;
  }
}
