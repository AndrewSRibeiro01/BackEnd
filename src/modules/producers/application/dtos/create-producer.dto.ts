import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateProducerDto {
  @ApiProperty({ example: '12345678901', description: 'CPF ou CNPJ (somente dígitos)' })
  @IsString()
  @Length(11, 14)
  document!: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @Length(1, 255)
  name!: string;
}
