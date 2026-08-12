import { ApiProperty } from '@nestjs/swagger';

import { Farm } from '../../domain/entities/farm.entity';

export class FarmResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  producerId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ example: 'MG' })
  state!: string;

  @ApiProperty({ example: 1500.5 })
  totalHa!: number;

  @ApiProperty({ example: 900 })
  arableHa!: number;

  @ApiProperty({ example: 500 })
  vegetationHa!: number;

  static fromDomain(farm: Farm): FarmResponseDto {
    const dto = new FarmResponseDto();
    dto.id = farm.id;
    dto.producerId = farm.producerId;
    dto.name = farm.name;
    dto.city = farm.city;
    dto.state = farm.state;
    dto.totalHa = farm.areas.totalHa;
    dto.arableHa = farm.areas.arableHa;
    dto.vegetationHa = farm.areas.vegetationHa;
    return dto;
  }
}
