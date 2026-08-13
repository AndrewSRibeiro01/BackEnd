import { Inject, Injectable } from '@nestjs/common';

import { ConflictError } from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../domain/entities/producer.entity';
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from '../../domain/repositories/producer.repository';

export interface CreateProducerInput {
  document: string;
  name: string;
}

@Injectable()
export class CreateProducerUseCase {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly repository: ProducerRepository,
  ) {}

  async execute(input: CreateProducerInput): Promise<Producer> {
    const producer = Producer.create(input);

    const existing = await this.repository.findByDocument(producer.document);
    if (existing) {
      throw new ConflictError('Já existe um produtor com este CPF/CNPJ');
    }

    return this.repository.create(producer);
  }
}
