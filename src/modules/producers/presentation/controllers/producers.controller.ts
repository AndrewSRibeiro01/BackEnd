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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateProducerDto } from '../../application/dtos/create-producer.dto';
import { ProducerResponseDto } from '../../application/dtos/producer-response.dto';
import { UpdateProducerDto } from '../../application/dtos/update-producer.dto';
import { CreateProducerUseCase } from '../../application/use-cases/create-producer.use-case';
import { DeleteProducerUseCase } from '../../application/use-cases/delete-producer.use-case';
import { FindAllProducersUseCase } from '../../application/use-cases/find-all-producers.use-case';
import { FindProducerByIdUseCase } from '../../application/use-cases/find-producer-by-id.use-case';
import { UpdateProducerUseCase } from '../../application/use-cases/update-producer.use-case';

@ApiTags('producers')
@Controller('producers')
export class ProducersController {
  constructor(
    private readonly createProducer: CreateProducerUseCase,
    private readonly findAllProducers: FindAllProducersUseCase,
    private readonly findProducerById: FindProducerByIdUseCase,
    private readonly updateProducer: UpdateProducerUseCase,
    private readonly deleteProducer: DeleteProducerUseCase,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Liveness probe' })
  health() {
    return { status: 'ok' };
  }

  @Post()
  @ApiOperation({ summary: 'Register a new producer' })
  @ApiCreatedResponse({ type: ProducerResponseDto })
  async create(@Body() dto: CreateProducerDto): Promise<ProducerResponseDto> {
    const producer = await this.createProducer.execute(dto);
    return ProducerResponseDto.fromDomain(producer);
  }

  @Get()
  @ApiOperation({ summary: 'List all producers' })
  @ApiOkResponse({ type: ProducerResponseDto, isArray: true })
  async findAll(): Promise<ProducerResponseDto[]> {
    const producers = await this.findAllProducers.execute();
    return producers.map(ProducerResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a producer by id' })
  @ApiOkResponse({ type: ProducerResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProducerResponseDto> {
    const producer = await this.findProducerById.execute(id);
    return ProducerResponseDto.fromDomain(producer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing producer' })
  @ApiOkResponse({ type: ProducerResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProducerDto,
  ): Promise<ProducerResponseDto> {
    const producer = await this.updateProducer.execute(id, dto);
    return ProducerResponseDto.fromDomain(producer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a producer' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteProducer.execute(id);
  }
}
