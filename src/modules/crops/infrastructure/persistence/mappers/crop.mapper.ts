import { Crop } from '../../../domain/entities/crop.entity';
import { CropOrmEntity } from '../entities/crop.orm-entity';

export class CropMapper {
  static toDomain(orm: CropOrmEntity): Crop {
    return Crop.restore({
      id: orm.id,
      harvestId: orm.harvestId,
      name: orm.name,
    });
  }

  static toOrm(domain: Crop): CropOrmEntity {
    const orm = new CropOrmEntity();
    orm.id = domain.id;
    orm.harvestId = domain.harvestId;
    orm.name = domain.name;
    return orm;
  }
}
