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

import { HarvestOrmEntity } from '../../../../harvests/infrastructure/persistence/entities/harvest.orm-entity';

@Entity({ name: 'crops' })
@Index('uq_crops_harvest_name', ['harvestId', 'name'], { unique: true })
export class CropOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'harvest_id', type: 'uuid' })
  harvestId!: string;

  @ManyToOne(() => HarvestOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'harvest_id' })
  harvest!: HarvestOrmEntity;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
