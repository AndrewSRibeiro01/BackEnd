import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('producers')
@Controller('producers')
export class ProducersController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
