import { Harvest } from '../../../domain/entities/harvest.entity';
import { HarvestOrmEntity } from '../entities/harvest.orm-entity';

export class HarvestMapper {
  static toDomain(orm: HarvestOrmEntity): Harvest {
    return Harvest.restore({
      id: orm.id,
      farmId: orm.farmId,
      year: orm.year,
    });
  }

  static toOrm(domain: Harvest): HarvestOrmEntity {
    const orm = new HarvestOrmEntity();
    orm.id = domain.id;
    orm.farmId = domain.farmId;
    orm.year = domain.year;
    return orm;
  }
}
