import { ApiProperty } from '@nestjs/swagger';

export class PieSliceDto {
  @ApiProperty({ example: 'MG' })
  label!: string;

  @ApiProperty({ example: 12 })
  value!: number;

  @ApiProperty({ example: 33.33 })
  percentage!: number;
}

export class LandUseSliceDto {
  @ApiProperty({ enum: ['arable', 'vegetation'], example: 'arable' })
  label!: 'arable' | 'vegetation';

  @ApiProperty({ example: 1200.5 })
  hectares!: number;

  @ApiProperty({ example: 60 })
  percentage!: number;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 42 })
  totalFarms!: number;

  @ApiProperty({ example: 15230.75 })
  totalHectares!: number;

  @ApiProperty({ type: PieSliceDto, isArray: true })
  farmsByState!: PieSliceDto[];

  @ApiProperty({ type: PieSliceDto, isArray: true })
  cropsByName!: PieSliceDto[];

  @ApiProperty({ type: LandUseSliceDto, isArray: true })
  landUse!: LandUseSliceDto[];
}
