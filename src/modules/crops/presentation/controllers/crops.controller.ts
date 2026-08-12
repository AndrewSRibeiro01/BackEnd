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

import { CreateCropDto } from '../../application/dtos/create-crop.dto';
import { CropResponseDto } from '../../application/dtos/crop-response.dto';
import { CreateCropUseCase } from '../../application/use-cases/create-crop.use-case';
import { DeleteCropUseCase } from '../../application/use-cases/delete-crop.use-case';
import { FindAllCropsUseCase } from '../../application/use-cases/find-all-crops.use-case';
import { FindCropByIdUseCase } from '../../application/use-cases/find-crop-by-id.use-case';

@ApiTags('crops')
@Controller('crops')
export class CropsController {
  constructor(
    private readonly createCrop: CreateCropUseCase,
    private readonly findAllCrops: FindAllCropsUseCase,
    private readonly findCropById: FindCropByIdUseCase,
    private readonly deleteCrop: DeleteCropUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a crop planted in a harvest' })
  @ApiCreatedResponse({ type: CropResponseDto })
  async create(@Body() dto: CreateCropDto): Promise<CropResponseDto> {
    const crop = await this.createCrop.execute(dto);
    return CropResponseDto.fromDomain(crop);
  }

  @Get()
  @ApiOperation({ summary: 'List crops (optionally filtered by harvestId)' })
  @ApiQuery({ name: 'harvestId', required: false, type: String })
  @ApiOkResponse({ type: CropResponseDto, isArray: true })
  async findAll(
    @Query('harvestId') harvestId?: string,
  ): Promise<CropResponseDto[]> {
    const crops = await this.findAllCrops.execute(harvestId);
    return crops.map(CropResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a crop by id' })
  @ApiOkResponse({ type: CropResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CropResponseDto> {
    const crop = await this.findCropById.execute(id);
    return CropResponseDto.fromDomain(crop);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a crop' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteCrop.execute(id);
  }
}
