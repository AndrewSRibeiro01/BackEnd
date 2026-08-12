import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DashboardResponseDto } from '../../application/dtos/dashboard-response.dto';
import { GetDashboardUseCase } from '../../application/use-cases/get-dashboard.use-case';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getDashboard: GetDashboardUseCase) {}

  @Get()
  @ApiOperation({
    summary:
      'Aggregated dashboard: totals, farms by state, crops by name, land use',
  })
  @ApiOkResponse({ type: DashboardResponseDto })
  async summary(): Promise<DashboardResponseDto> {
    return this.getDashboard.execute();
  }
}
