import { EntityNotFound } from '../../../../shared/exceptions/domain.exception';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { DeleteProducerUseCase } from './delete-producer.use-case';

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

describe('DeleteProducerUseCase', () => {
  let repository: jest.Mocked<ProducerRepository>;
  let useCase: DeleteProducerUseCase;

  beforeEach(() => {
    repository = makeRepositoryMock();
    useCase = new DeleteProducerUseCase(repository);
  });

  it('deletes an existing producer', async () => {
    const producer = Producer.create({
      document: '11144477735',
      name: 'John',
    });
    repository.findById.mockResolvedValue(producer);

    await useCase.execute(producer.id);
    expect(repository.delete).toHaveBeenCalledWith(producer.id);
  });

  it('throws EntityNotFound when the producer does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      EntityNotFound,
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
