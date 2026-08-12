import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FarmsModule } from '../farms/farms.module';
import { CreateHarvestUseCase } from './application/use-cases/create-harvest.use-case';
import { DeleteHarvestUseCase } from './application/use-cases/delete-harvest.use-case';
import { FindAllHarvestsUseCase } from './application/use-cases/find-all-harvests.use-case';
import { FindHarvestByIdUseCase } from './application/use-cases/find-harvest-by-id.use-case';
import { HARVEST_REPOSITORY } from './domain/repositories/harvest.repository';
import { HarvestOrmEntity } from './infrastructure/persistence/entities/harvest.orm-entity';
import { HarvestTypeOrmRepository } from './infrastructure/persistence/repositories/harvest.typeorm.repository';
import { HarvestsController } from './presentation/controllers/harvests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HarvestOrmEntity]), FarmsModule],
  controllers: [HarvestsController],
  providers: [
    {
      provide: HARVEST_REPOSITORY,
      useClass: HarvestTypeOrmRepository,
    },
    CreateHarvestUseCase,
    FindAllHarvestsUseCase,
    FindHarvestByIdUseCase,
    DeleteHarvestUseCase,
  ],
  exports: [HARVEST_REPOSITORY],
})
export class HarvestsModule {}
