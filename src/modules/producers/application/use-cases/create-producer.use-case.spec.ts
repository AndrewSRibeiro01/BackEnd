import {
  BusinessRuleViolation,
  ConflictError,
} from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { CreateProducerUseCase } from './create-producer.use-case';

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

describe('CreateProducerUseCase', () => {
  let repository: jest.Mocked<ProducerRepository>;
  let useCase: CreateProducerUseCase;

  beforeEach(() => {
    repository = makeRepositoryMock();
    useCase = new CreateProducerUseCase(repository);
  });

  it('creates a producer when the document is not taken', async () => {
    repository.findByDocument.mockResolvedValue(null);
    repository.create.mockImplementation(async (p) => p);

    const producer = await useCase.execute({
      document: '111.444.777-35',
      name: 'João',
    });

    expect(producer.document).toBe('11144477735');
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('throws ConflictError when the document already exists', async () => {
    repository.findByDocument.mockResolvedValue(
      Producer.create({ document: '11144477735', name: 'Existing' }),
    );

    await expect(
      useCase.execute({ document: '11144477735', name: 'New' }),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects invalid documents before hitting the repository', async () => {
    await expect(
      useCase.execute({ document: '00000000000', name: 'Any' }),
    ).rejects.toBeInstanceOf(BusinessRuleViolation);
    expect(repository.findByDocument).not.toHaveBeenCalled();
  });
});
