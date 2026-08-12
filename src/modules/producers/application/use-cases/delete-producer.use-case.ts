import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from '../../domain/repositories/producer.repository';

@Injectable()
export class DeleteProducerUseCase {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly repository: ProducerRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new EntityNotFound('Producer', id);
    }
    await this.repository.delete(id);
  }
}
