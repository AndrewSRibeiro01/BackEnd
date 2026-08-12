import {
  ConflictError,
  EntityNotFound,
} from '../../../../shared/exceptions/domain.exception';
import { Farm } from '../../../farms/domain/entities/farm.entity';
import { FarmRepository } from '../../../farms/domain/repositories/farm.repository';
import { Harvest } from '../../domain/entities/harvest.entity';
import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { CreateHarvestUseCase } from './create-harvest.use-case';

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

function makeFarmRepo(): jest.Mocked<FarmRepository> {
  return {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByProducerId: jest.fn(),
  };
}

const farmProps = {
  producerId: '11111111-1111-1111-1111-111111111111',
  name: 'Fazenda',
  city: 'Uberaba',
  state: 'MG',
  totalHa: 100,
  arableHa: 60,
  vegetationHa: 40,
};

describe('CreateHarvestUseCase', () => {
  let harvestRepo: jest.Mocked<HarvestRepository>;
  let farmRepo: jest.Mocked<FarmRepository>;
  let useCase: CreateHarvestUseCase;
  let farm: Farm;

  beforeEach(() => {
    harvestRepo = makeHarvestRepo();
    farmRepo = makeFarmRepo();
    useCase = new CreateHarvestUseCase(harvestRepo, farmRepo);
    farm = Farm.create(farmProps);
    farmRepo.findById.mockResolvedValue(farm);
    harvestRepo.create.mockImplementation(async (h) => h);
  });

  it('creates a harvest when the farm exists and the year is free', async () => {
    harvestRepo.findByFarmAndYear.mockResolvedValue(null);
    const harvest = await useCase.execute({ farmId: farm.id, year: 2024 });
    expect(harvest.year).toBe(2024);
    expect(harvestRepo.create).toHaveBeenCalledTimes(1);
  });

  it('throws EntityNotFound when the farm does not exist', async () => {
    farmRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ farmId: 'missing', year: 2024 }),
    ).rejects.toBeInstanceOf(EntityNotFound);
  });

  it('throws ConflictError when the year already exists for the farm', async () => {
    harvestRepo.findByFarmAndYear.mockResolvedValue(
      Harvest.create({ farmId: farm.id, year: 2024 }),
    );
    await expect(
      useCase.execute({ farmId: farm.id, year: 2024 }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
