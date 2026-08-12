import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HarvestsModule } from '../harvests/harvests.module';
import { CreateCropUseCase } from './application/use-cases/create-crop.use-case';
import { DeleteCropUseCase } from './application/use-cases/delete-crop.use-case';
import { FindAllCropsUseCase } from './application/use-cases/find-all-crops.use-case';
import { FindCropByIdUseCase } from './application/use-cases/find-crop-by-id.use-case';
import { CROP_REPOSITORY } from './domain/repositories/crop.repository';
import { CropOrmEntity } from './infrastructure/persistence/entities/crop.orm-entity';
import { CropTypeOrmRepository } from './infrastructure/persistence/repositories/crop.typeorm.repository';
import { CropsController } from './presentation/controllers/crops.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CropOrmEntity]), HarvestsModule],
  controllers: [CropsController],
  providers: [
    {
      provide: CROP_REPOSITORY,
      useClass: CropTypeOrmRepository,
    },
    CreateCropUseCase,
    FindAllCropsUseCase,
    FindCropByIdUseCase,
    DeleteCropUseCase,
  ],
  exports: [CROP_REPOSITORY],
})
export class CropsModule {}
