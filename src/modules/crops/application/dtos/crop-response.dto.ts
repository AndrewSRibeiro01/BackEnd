import { ApiProperty } from '@nestjs/swagger';

import { Crop } from '../../domain/entities/crop.entity';

export class CropResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  harvestId!: string;

  @ApiProperty({ example: 'Soja' })
  name!: string;

  static fromDomain(crop: Crop): CropResponseDto {
    const dto = new CropResponseDto();
    dto.id = crop.id;
    dto.harvestId = crop.harvestId;
    dto.name = crop.name;
    return dto;
  }
}
