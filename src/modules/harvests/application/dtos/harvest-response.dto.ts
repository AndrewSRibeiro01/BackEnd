import { ApiProperty } from '@nestjs/swagger';

import { Harvest } from '../../domain/entities/harvest.entity';

export class HarvestResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  farmId!: string;

  @ApiProperty({ example: 2024 })
  year!: number;

  @ApiProperty({ example: 'Safra 2024' })
  label!: string;

  static fromDomain(harvest: Harvest): HarvestResponseDto {
    const dto = new HarvestResponseDto();
    dto.id = harvest.id;
    dto.farmId = harvest.farmId;
    dto.year = harvest.year;
    dto.label = harvest.label;
    return dto;
  }
}
