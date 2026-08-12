import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateProducerUseCase } from './application/use-cases/create-producer.use-case';
import { DeleteProducerUseCase } from './application/use-cases/delete-producer.use-case';
import { FindAllProducersUseCase } from './application/use-cases/find-all-producers.use-case';
import { FindProducerByIdUseCase } from './application/use-cases/find-producer-by-id.use-case';
import { UpdateProducerUseCase } from './application/use-cases/update-producer.use-case';
import { PRODUCER_REPOSITORY } from './domain/repositories/producer.repository';
import { ProducerOrmEntity } from './infrastructure/persistence/entities/producer.orm-entity';
import { ProducerTypeOrmRepository } from './infrastructure/persistence/repositories/producer.typeorm.repository';
import { ProducersController } from './presentation/controllers/producers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProducerOrmEntity])],
  controllers: [ProducersController],
  providers: [
    {
      provide: PRODUCER_REPOSITORY,
      useClass: ProducerTypeOrmRepository,
    },
    CreateProducerUseCase,
    FindAllProducersUseCase,
    FindProducerByIdUseCase,
    UpdateProducerUseCase,
    DeleteProducerUseCase,
  ],
  exports: [PRODUCER_REPOSITORY],
})
export class ProducersModule {}
