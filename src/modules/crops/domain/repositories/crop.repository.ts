import { Crop } from '../entities/crop.entity';

export const CROP_REPOSITORY = Symbol('CROP_REPOSITORY');

export interface CropRepository {
  create(crop: Crop): Promise<Crop>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Crop | null>;
  findByHarvestAndName(harvestId: string, name: string): Promise<Crop | null>;
  findByHarvestId(harvestId: string): Promise<Crop[]>;
  findAll(): Promise<Crop[]>;
}
