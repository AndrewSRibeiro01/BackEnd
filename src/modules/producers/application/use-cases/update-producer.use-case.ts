import { Inject, Injectable } from '@nestjs/common';

import {
  ConflictError,
  EntityNotFound,
} from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../domain/entities/producer.entity';
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from '../../domain/repositories/producer.repository';

export interface UpdateProducerInput {
  document?: string;
  name?: string;
}

@Injectable()
export class UpdateProducerUseCase {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly repository: ProducerRepository,
  ) {}

  async execute(id: string, input: UpdateProducerInput): Promise<Producer> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new EntityNotFound('Producer', id);
    }

    let updated = existing;
    if (input.name !== undefined) updated = updated.rename(input.name);
    if (input.document !== undefined) {
      updated = updated.changeDocument(input.document);
      if (updated.document !== existing.document) {
        const conflict = await this.repository.findByDocument(updated.document);
        if (conflict && conflict.id !== id) {
          throw new ConflictError('Já existe um produtor com este CPF/CNPJ');
        }
      }
    }

    return this.repository.update(updated);
  }
}
