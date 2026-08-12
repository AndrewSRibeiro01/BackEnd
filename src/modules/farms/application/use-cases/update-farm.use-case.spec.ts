import {
  BusinessRuleViolation,
  EntityNotFound,
} from '../../../../shared/exceptions/domain.exception';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmRepository } from '../../domain/repositories/farm.repository';
import { UpdateFarmUseCase } from './update-farm.use-case';

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

const baseFarm = () =>
  Farm.create({
    producerId: '11111111-1111-1111-1111-111111111111',
    name: 'Fazenda',
    city: 'Uberaba',
    state: 'MG',
    totalHa: 100,
    arableHa: 60,
    vegetationHa: 40,
  });

describe('UpdateFarmUseCase', () => {
  let repo: jest.Mocked<FarmRepository>;
  let useCase: UpdateFarmUseCase;

  beforeEach(() => {
    repo = makeFarmRepo();
    useCase = new UpdateFarmUseCase(repo);
    repo.update.mockImplementation(async (f) => f);
  });

  it('updates fields and returns the new farm', async () => {
    const farm = baseFarm();
    repo.findById.mockResolvedValue(farm);

    const updated = await useCase.execute(farm.id, { city: 'Belo Horizonte' });
    expect(updated.city).toBe('Belo Horizonte');
  });

  it('throws EntityNotFound when the farm does not exist', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute('missing', { city: 'X' }),
    ).rejects.toBeInstanceOf(EntityNotFound);
  });

  it('propagates area invariant violations', async () => {
    const farm = baseFarm();
    repo.findById.mockResolvedValue(farm);

    await expect(
      useCase.execute(farm.id, { arableHa: 90 }),
    ).rejects.toBeInstanceOf(BusinessRuleViolation);
  });
});
