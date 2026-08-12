import { Farm } from '../entities/farm.entity';

export const FARM_REPOSITORY = Symbol('FARM_REPOSITORY');

export interface FarmRepository {
  create(farm: Farm): Promise<Farm>;
  update(farm: Farm): Promise<Farm>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Farm | null>;
  findAll(): Promise<Farm[]>;
  findByProducerId(producerId: string): Promise<Farm[]>;
}
