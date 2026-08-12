import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CreateHarvestDto } from '../../application/dtos/create-harvest.dto';
import { HarvestResponseDto } from '../../application/dtos/harvest-response.dto';
import { CreateHarvestUseCase } from '../../application/use-cases/create-harvest.use-case';
import { DeleteHarvestUseCase } from '../../application/use-cases/delete-harvest.use-case';
import { FindAllHarvestsUseCase } from '../../application/use-cases/find-all-harvests.use-case';
import { FindHarvestByIdUseCase } from '../../application/use-cases/find-harvest-by-id.use-case';

@ApiTags('harvests')
@Controller('harvests')
export class HarvestsController {
  constructor(
    private readonly createHarvest: CreateHarvestUseCase,
    private readonly findAllHarvests: FindAllHarvestsUseCase,
    private readonly findHarvestById: FindHarvestByIdUseCase,
    private readonly deleteHarvest: DeleteHarvestUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new harvest (season) for a farm' })
  @ApiCreatedResponse({ type: HarvestResponseDto })
  async create(@Body() dto: CreateHarvestDto): Promise<HarvestResponseDto> {
    const harvest = await this.createHarvest.execute(dto);
    return HarvestResponseDto.fromDomain(harvest);
  }

  @Get()
  @ApiOperation({ summary: 'List harvests (optionally filtered by farmId)' })
  @ApiQuery({ name: 'farmId', required: false, type: String })
  @ApiOkResponse({ type: HarvestResponseDto, isArray: true })
  async findAll(
    @Query('farmId') farmId?: string,
  ): Promise<HarvestResponseDto[]> {
    const harvests = await this.findAllHarvests.execute(farmId);
    return harvests.map(HarvestResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a harvest by id' })
  @ApiOkResponse({ type: HarvestResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HarvestResponseDto> {
    const harvest = await this.findHarvestById.execute(id);
    return HarvestResponseDto.fromDomain(harvest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a harvest' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteHarvest.execute(id);
  }
}
