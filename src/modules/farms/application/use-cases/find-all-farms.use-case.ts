import { Inject, Injectable } from '@nestjs/common';

import { Farm } from '../../domain/entities/farm.entity';
import {
  FARM_REPOSITORY,
  FarmRepository,
} from '../../domain/repositories/farm.repository';

@Injectable()
export class FindAllFarmsUseCase {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly repository: FarmRepository,
  ) {}

  execute(producerId?: string): Promise<Farm[]> {
    return producerId
      ? this.repository.findByProducerId(producerId)
      : this.repository.findAll();
  }
}
