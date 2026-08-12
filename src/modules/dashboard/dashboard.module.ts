import { Module } from '@nestjs/common';

import { CropsModule } from '../crops/crops.module';
import { FarmsModule } from '../farms/farms.module';
import { GetDashboardUseCase } from './application/use-cases/get-dashboard.use-case';
import { DashboardController } from './presentation/controllers/dashboard.controller';

@Module({
  imports: [FarmsModule, CropsModule],
  controllers: [DashboardController],
  providers: [GetDashboardUseCase],
})
export class DashboardModule {}
