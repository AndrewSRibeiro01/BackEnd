import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { BRAZILIAN_STATES } from '../../domain/entities/brazilian-state';

export class CreateFarmDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  producerId!: string;

  @ApiProperty({ example: 'Fazenda Boa Vista' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'Uberaba' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  city!: string;

  @ApiProperty({ enum: BRAZILIAN_STATES, example: 'MG' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(BRAZILIAN_STATES as unknown as string[])
  state!: string;

  @ApiProperty({ example: 1500.5, description: 'Área total em hectares' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalHa!: number;

  @ApiProperty({ example: 900, description: 'Área agricultável em hectares' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  arableHa!: number;

  @ApiProperty({ example: 500, description: 'Área de vegetação em hectares' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  vegetationHa!: number;
}
