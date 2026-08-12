import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { IsCpfOrCnpj } from '../../../../shared/validation/is-cpf-or-cnpj.decorator';
import { stripDocument } from '../../../../shared/validation/document.validator';

export class CreateProducerDto {
  @ApiProperty({
    example: '12345678909',
    description: 'CPF (11 dígitos) ou CNPJ (14 dígitos). Aceita com ou sem máscara.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? stripDocument(value) : value,
  )
  @IsString()
  @IsCpfOrCnpj()
  document!: string;

  @ApiProperty({ example: 'João da Silva' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;
}
