import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProducerOrmEntity } from './infrastructure/persistence/entities/producer.orm-entity';
import { ProducersController } from './presentation/controllers/producers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProducerOrmEntity])],
  controllers: [ProducersController],
  providers: [],
  exports: [],
})
export class ProducersModule {}
