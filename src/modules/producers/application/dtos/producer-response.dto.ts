import { ApiProperty } from '@nestjs/swagger';

import { Producer } from '../../domain/entities/producer.entity';

export class ProducerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: '12345678909' })
  document!: string;

  @ApiProperty({ example: 'João da Silva' })
  name!: string;

  static fromDomain(producer: Producer): ProducerResponseDto {
    const dto = new ProducerResponseDto();
    dto.id = producer.id;
    dto.document = producer.document;
    dto.name = producer.name;
    return dto;
  }
}
