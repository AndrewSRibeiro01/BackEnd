import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  farmId!: string;

  @ApiProperty({ example: 2024, minimum: 2000, maximum: 2100 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year!: number;
}
