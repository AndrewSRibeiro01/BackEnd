import { Farm } from '../../../domain/entities/farm.entity';
import { FarmOrmEntity } from '../entities/farm.orm-entity';

export class FarmMapper {
  static toDomain(orm: FarmOrmEntity): Farm {
    return Farm.restore({
      id: orm.id,
      producerId: orm.producerId,
      name: orm.name,
      city: orm.city,
      state: orm.state,
      totalHa: Number(orm.totalHa),
      arableHa: Number(orm.arableHa),
      vegetationHa: Number(orm.vegetationHa),
    });
  }

  static toOrm(domain: Farm): FarmOrmEntity {
    const orm = new FarmOrmEntity();
    orm.id = domain.id;
    orm.producerId = domain.producerId;
    orm.name = domain.name;
    orm.city = domain.city;
    orm.state = domain.state;
    orm.totalHa = domain.areas.totalHa;
    orm.arableHa = domain.areas.arableHa;
    orm.vegetationHa = domain.areas.vegetationHa;
    return orm;
  }
}
