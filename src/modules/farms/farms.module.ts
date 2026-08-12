import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProducersModule } from '../producers/producers.module';
import { CreateFarmUseCase } from './application/use-cases/create-farm.use-case';
import { DeleteFarmUseCase } from './application/use-cases/delete-farm.use-case';
import { FindAllFarmsUseCase } from './application/use-cases/find-all-farms.use-case';
import { FindFarmByIdUseCase } from './application/use-cases/find-farm-by-id.use-case';
import { UpdateFarmUseCase } from './application/use-cases/update-farm.use-case';
import { FARM_REPOSITORY } from './domain/repositories/farm.repository';
import { FarmOrmEntity } from './infrastructure/persistence/entities/farm.orm-entity';
import { FarmTypeOrmRepository } from './infrastructure/persistence/repositories/farm.typeorm.repository';
import { FarmsController } from './presentation/controllers/farms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FarmOrmEntity]), ProducersModule],
  controllers: [FarmsController],
  providers: [
    {
      provide: FARM_REPOSITORY,
      useClass: FarmTypeOrmRepository,
    },
    CreateFarmUseCase,
    FindAllFarmsUseCase,
    FindFarmByIdUseCase,
    UpdateFarmUseCase,
    DeleteFarmUseCase,
  ],
  exports: [FARM_REPOSITORY],
})
export class FarmsModule {}
