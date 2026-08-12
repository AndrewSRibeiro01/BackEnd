import { Crop } from '../../../crops/domain/entities/crop.entity';
import { CropRepository } from '../../../crops/domain/repositories/crop.repository';
import { Farm } from '../../../farms/domain/entities/farm.entity';
import { FarmRepository } from '../../../farms/domain/repositories/farm.repository';
import { GetDashboardUseCase } from './get-dashboard.use-case';

function makeFarmRepo(farms: Farm[]): jest.Mocked<FarmRepository> {
  return {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn().mockResolvedValue(farms),
    findByProducerId: jest.fn(),
  };
}

function makeCropRepo(crops: Crop[]): jest.Mocked<CropRepository> {
  return {
    create: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByHarvestAndName: jest.fn(),
    findByHarvestId: jest.fn(),
    findAll: jest.fn().mockResolvedValue(crops),
  };
}

const producerId = '11111111-1111-1111-1111-111111111111';
const harvestId = '22222222-2222-2222-2222-222222222222';

function makeFarm(state: string, total: number, arable: number, veg: number) {
  return Farm.create({
    producerId,
    name: `Farm ${state}-${total}`,
    city: 'X',
    state,
    totalHa: total,
    arableHa: arable,
    vegetationHa: veg,
  });
}

describe('GetDashboardUseCase', () => {
  it('returns zeroed dashboard when there is no data', async () => {
    const useCase = new GetDashboardUseCase(makeFarmRepo([]), makeCropRepo([]));
    const result = await useCase.execute();
    expect(result.totalFarms).toBe(0);
    expect(result.totalHectares).toBe(0);
    expect(result.farmsByState).toEqual([]);
    expect(result.cropsByName).toEqual([]);
    expect(result.landUse).toEqual([
      { label: 'arable', hectares: 0, percentage: 0 },
      { label: 'vegetation', hectares: 0, percentage: 0 },
    ]);
  });

  it('aggregates totals, state distribution and land use', async () => {
    const farms = [
      makeFarm('MG', 100, 60, 40),
      makeFarm('MG', 200, 100, 80),
      makeFarm('SP', 50, 30, 20),
    ];
    const useCase = new GetDashboardUseCase(
      makeFarmRepo(farms),
      makeCropRepo([]),
    );

    const result = await useCase.execute();

    expect(result.totalFarms).toBe(3);
    expect(result.totalHectares).toBe(350);
    expect(result.farmsByState).toEqual([
      { label: 'MG', value: 2, percentage: 66.67 },
      { label: 'SP', value: 1, percentage: 33.33 },
    ]);
    expect(result.landUse).toEqual([
      { label: 'arable', hectares: 190, percentage: 57.58 },
      { label: 'vegetation', hectares: 140, percentage: 42.42 },
    ]);
  });

  it('counts each crop occurrence and returns them sorted by frequency', async () => {
    const crops = [
      Crop.create({ harvestId, name: 'Soja' }),
      Crop.create({ harvestId, name: 'Soja' }),
      Crop.create({ harvestId, name: 'Milho' }),
    ];
    const useCase = new GetDashboardUseCase(
      makeFarmRepo([]),
      makeCropRepo(crops),
    );

    const result = await useCase.execute();

    expect(result.cropsByName).toEqual([
      { label: 'Soja', value: 2, percentage: 66.67 },
      { label: 'Milho', value: 1, percentage: 33.33 },
    ]);
  });
});
