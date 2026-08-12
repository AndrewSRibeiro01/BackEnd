import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { FindProducerByIdUseCase } from './find-producer-by-id.use-case';

function makeRepositoryMock(): jest.Mocked<ProducerRepository> {
  return {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByDocument: jest.fn(),
    findAll: jest.fn(),
  };
}

describe('FindProducerByIdUseCase', () => {
  let repository: jest.Mocked<ProducerRepository>;
  let useCase: FindProducerByIdUseCase;

  beforeEach(() => {
    repository = makeRepositoryMock();
    useCase = new FindProducerByIdUseCase(repository);
  });

  it('returns the producer when found', async () => {
    const producer = Producer.create({
      document: '11144477735',
      name: 'John',
    });
    repository.findById.mockResolvedValue(producer);

    const result = await useCase.execute(producer.id);
    expect(result).toBe(producer);
  });

  it('throws EntityNotFound when the producer is missing', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      EntityNotFound,
    );
  });
});
