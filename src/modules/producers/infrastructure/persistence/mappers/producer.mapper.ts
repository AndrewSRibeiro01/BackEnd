import { Producer } from '../../../domain/entities/producer.entity';
import { ProducerOrmEntity } from '../entities/producer.orm-entity';

export class ProducerMapper {
  static toDomain(orm: ProducerOrmEntity): Producer {
    return Producer.restore({
      id: orm.id,
      document: orm.document,
      name: orm.name,
    });
  }

  static toOrm(domain: Producer): ProducerOrmEntity {
    const orm = new ProducerOrmEntity();
    orm.id = domain.id;
    orm.document = domain.document;
    orm.name = domain.name;
    return orm;
  }
}
