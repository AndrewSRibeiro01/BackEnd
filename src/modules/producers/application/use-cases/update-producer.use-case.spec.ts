import {
  ConflictError,
  EntityNotFound,
} from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { UpdateProducerUseCase } from './update-producer.use-case';

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

describe('UpdateProducerUseCase', () => {
  let repository: jest.Mocked<ProducerRepository>;
  let useCase: UpdateProducerUseCase;
  let existing: Producer;

  beforeEach(() => {
    repository = makeRepositoryMock();
    useCase = new UpdateProducerUseCase(repository);
    existing = Producer.create({ document: '11144477735', name: 'Old' });
    repository.findById.mockResolvedValue(existing);
    repository.update.mockImplementation(async (p) => p);
  });

  it('renames a producer', async () => {
    const result = await useCase.execute(existing.id, { name: 'New' });
    expect(result.name).toBe('New');
    expect(result.document).toBe(existing.document);
  });

  it('changes the document when the new one is free', async () => {
    repository.findByDocument.mockResolvedValue(null);
    const result = await useCase.execute(existing.id, {
      document: '11222333000181',
    });
    expect(result.document).toBe('11222333000181');
  });

  it('throws ConflictError when the new document is taken', async () => {
    const other = Producer.create({
      document: '11222333000181',
      name: 'Other',
    });
    repository.findByDocument.mockResolvedValue(other);

    await expect(
      useCase.execute(existing.id, { document: '11222333000181' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('throws EntityNotFound when the id does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute('missing', { name: 'Whatever' }),
    ).rejects.toBeInstanceOf(EntityNotFound);
  });
});
