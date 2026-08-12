import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FarmOrmEntity } from '../../../../farms/infrastructure/persistence/entities/farm.orm-entity';

@Entity({ name: 'harvests' })
@Index('uq_harvests_farm_year', ['farmId', 'year'], { unique: true })
export class HarvestOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId!: string;

  @ManyToOne(() => FarmOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm!: FarmOrmEntity;

  @Column({ type: 'int' })
  year!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
