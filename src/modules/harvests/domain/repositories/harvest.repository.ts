import { Harvest } from '../entities/harvest.entity';

export const HARVEST_REPOSITORY = Symbol('HARVEST_REPOSITORY');

export interface HarvestRepository {
  create(harvest: Harvest): Promise<Harvest>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Harvest | null>;
  findByFarmAndYear(farmId: string, year: number): Promise<Harvest | null>;
  findByFarmId(farmId: string): Promise<Harvest[]>;
  findAll(): Promise<Harvest[]>;
}
