import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../../producers/domain/entities/producer.entity';
import { ProducerRepository } from '../../../producers/domain/repositories/producer.repository';
import { FarmRepository } from '../../domain/repositories/farm.repository';
import { CreateFarmUseCase } from './create-farm.use-case';

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

function makeProducerRepo(): jest.Mocked<ProducerRepository> {
  return {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByDocument: jest.fn(),
    findAll: jest.fn(),
  };
}

const baseInput = {
  producerId: '11111111-1111-1111-1111-111111111111',
  name: 'Fazenda',
  city: 'Uberaba',
  state: 'MG',
  totalHa: 100,
  arableHa: 60,
  vegetationHa: 40,
};

describe('CreateFarmUseCase', () => {
  let farmRepo: jest.Mocked<FarmRepository>;
  let producerRepo: jest.Mocked<ProducerRepository>;
  let useCase: CreateFarmUseCase;

  beforeEach(() => {
    farmRepo = makeFarmRepo();
    producerRepo = makeProducerRepo();
    useCase = new CreateFarmUseCase(farmRepo, producerRepo);
  });

  it('creates a farm when the producer exists', async () => {
    producerRepo.findById.mockResolvedValue(
      Producer.create({ document: '11144477735', name: 'Owner' }),
    );
    farmRepo.create.mockImplementation(async (f) => f);

    const farm = await useCase.execute(baseInput);

    expect(farm.name).toBe('Fazenda');
    expect(farmRepo.create).toHaveBeenCalledTimes(1);
  });

  it('throws EntityNotFound when the producer does not exist', async () => {
    producerRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(baseInput)).rejects.toBeInstanceOf(
      EntityNotFound,
    );
    expect(farmRepo.create).not.toHaveBeenCalled();
  });
});
