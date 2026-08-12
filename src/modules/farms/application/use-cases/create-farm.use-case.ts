import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from '../../../producers/domain/repositories/producer.repository';
import { Farm } from '../../domain/entities/farm.entity';
import {
  FARM_REPOSITORY,
  FarmRepository,
} from '../../domain/repositories/farm.repository';

export interface CreateFarmInput {
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalHa: number;
  arableHa: number;
  vegetationHa: number;
}

@Injectable()
export class CreateFarmUseCase {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: FarmRepository,
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
  ) {}

  async execute(input: CreateFarmInput): Promise<Farm> {
    const producer = await this.producerRepository.findById(input.producerId);
    if (!producer) {
      throw new EntityNotFound('Producer', input.producerId);
    }
    const farm = Farm.create(input);
    return this.farmRepository.create(farm);
  }
}
