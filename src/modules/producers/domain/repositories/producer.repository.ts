import { Producer } from '../entities/producer.entity';

export const PRODUCER_REPOSITORY = Symbol('PRODUCER_REPOSITORY');

export interface ProducerRepository {
  create(producer: Producer): Promise<Producer>;
  update(producer: Producer): Promise<Producer>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Producer | null>;
  findByDocument(document: string): Promise<Producer | null>;
  findAll(): Promise<Producer[]>;
}
