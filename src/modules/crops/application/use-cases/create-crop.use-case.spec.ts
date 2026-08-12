import {
  ConflictError,
  EntityNotFound,
} from '../../../../shared/exceptions/domain.exception';
import { Harvest } from '../../../harvests/domain/entities/harvest.entity';
import { HarvestRepository } from '../../../harvests/domain/repositories/harvest.repository';
import { Crop } from '../../domain/entities/crop.entity';
import { CropRepository } from '../../domain/repositories/crop.repository';
import { CreateCropUseCase } from './create-crop.use-case';

function makeCropRepo(): jest.Mocked<CropRepository> {
  return {
    create: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByHarvestAndName: jest.fn(),
    findByHarvestId: jest.fn(),
    findAll: jest.fn(),
  };
}

function makeHarvestRepo(): jest.Mocked<HarvestRepository> {
  return {
    create: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByFarmAndYear: jest.fn(),
    findByFarmId: jest.fn(),
    findAll: jest.fn(),
  };
}

describe('CreateCropUseCase', () => {
  let cropRepo: jest.Mocked<CropRepository>;
  let harvestRepo: jest.Mocked<HarvestRepository>;
  let useCase: CreateCropUseCase;
  let harvest: Harvest;

  beforeEach(() => {
    cropRepo = makeCropRepo();
    harvestRepo = makeHarvestRepo();
    useCase = new CreateCropUseCase(cropRepo, harvestRepo);
    harvest = Harvest.create({
      farmId: '11111111-1111-1111-1111-111111111111',
      year: 2024,
    });
    harvestRepo.findById.mockResolvedValue(harvest);
    cropRepo.create.mockImplementation(async (c) => c);
  });

  it('creates a crop when the harvest exists and name is not taken', async () => {
    cropRepo.findByHarvestAndName.mockResolvedValue(null);
    const crop = await useCase.execute({
      harvestId: harvest.id,
      name: 'Soja',
    });
    expect(crop.name).toBe('Soja');
    expect(cropRepo.create).toHaveBeenCalledTimes(1);
  });

  it('throws EntityNotFound when the harvest does not exist', async () => {
    harvestRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ harvestId: 'missing', name: 'Soja' }),
    ).rejects.toBeInstanceOf(EntityNotFound);
  });

  it('throws ConflictError when the crop name is already registered for the harvest', async () => {
    cropRepo.findByHarvestAndName.mockResolvedValue(
      Crop.create({ harvestId: harvest.id, name: 'Soja' }),
    );
    await expect(
      useCase.execute({ harvestId: harvest.id, name: 'Soja' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
