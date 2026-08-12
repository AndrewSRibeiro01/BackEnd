import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../domain/entities/producer.entity';
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from '../../domain/repositories/producer.repository';

@Injectable()
export class FindProducerByIdUseCase {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly repository: ProducerRepository,
  ) {}

  async execute(id: string): Promise<Producer> {
    const producer = await this.repository.findById(id);
    if (!producer) {
      throw new EntityNotFound('Producer', id);
    }
    return producer;
  }
}
