import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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

import { CreateFarmDto } from '../../application/dtos/create-farm.dto';
import { FarmResponseDto } from '../../application/dtos/farm-response.dto';
import { UpdateFarmDto } from '../../application/dtos/update-farm.dto';
import { CreateFarmUseCase } from '../../application/use-cases/create-farm.use-case';
import { DeleteFarmUseCase } from '../../application/use-cases/delete-farm.use-case';
import { FindAllFarmsUseCase } from '../../application/use-cases/find-all-farms.use-case';
import { FindFarmByIdUseCase } from '../../application/use-cases/find-farm-by-id.use-case';
import { UpdateFarmUseCase } from '../../application/use-cases/update-farm.use-case';

@ApiTags('farms')
@Controller('farms')
export class FarmsController {
  constructor(
    private readonly createFarm: CreateFarmUseCase,
    private readonly findAllFarms: FindAllFarmsUseCase,
    private readonly findFarmById: FindFarmByIdUseCase,
    private readonly updateFarm: UpdateFarmUseCase,
    private readonly deleteFarm: DeleteFarmUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new farm for a producer' })
  @ApiCreatedResponse({ type: FarmResponseDto })
  async create(@Body() dto: CreateFarmDto): Promise<FarmResponseDto> {
    const farm = await this.createFarm.execute(dto);
    return FarmResponseDto.fromDomain(farm);
  }

  @Get()
  @ApiOperation({ summary: 'List farms (optionally filtered by producerId)' })
  @ApiQuery({ name: 'producerId', required: false, type: String })
  @ApiOkResponse({ type: FarmResponseDto, isArray: true })
  async findAll(
    @Query('producerId') producerId?: string,
  ): Promise<FarmResponseDto[]> {
    const farms = await this.findAllFarms.execute(producerId);
    return farms.map(FarmResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a farm by id' })
  @ApiOkResponse({ type: FarmResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FarmResponseDto> {
    const farm = await this.findFarmById.execute(id);
    return FarmResponseDto.fromDomain(farm);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing farm' })
  @ApiOkResponse({ type: FarmResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFarmDto,
  ): Promise<FarmResponseDto> {
    const farm = await this.updateFarm.execute(id, dto);
    return FarmResponseDto.fromDomain(farm);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a farm' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteFarm.execute(id);
  }
}
