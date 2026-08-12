import { Inject, Injectable } from '@nestjs/common';

import { Producer } from '../../domain/entities/producer.entity';
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from '../../domain/repositories/producer.repository';

@Injectable()
export class FindAllProducersUseCase {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly repository: ProducerRepository,
  ) {}

  execute(): Promise<Producer[]> {
    return this.repository.findAll();
  }
}
