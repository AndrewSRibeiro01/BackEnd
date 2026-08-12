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

import { ProducerOrmEntity } from '../../../../producers/infrastructure/persistence/entities/producer.orm-entity';

const numericTransformer = {
  to: (value: number | null | undefined): number | null | undefined => value,
  from: (value: string | null): number | null =>
    value === null ? null : Number(value),
};

@Entity({ name: 'farms' })
export class FarmOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'producer_id', type: 'uuid' })
  producerId!: string;

  @ManyToOne(() => ProducerOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producer_id' })
  producer!: ProducerOrmEntity;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  city!: string;

  @Column({ type: 'char', length: 2 })
  state!: string;

  @Column({
    name: 'total_ha',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  totalHa!: number;

  @Column({
    name: 'arable_ha',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  arableHa!: number;

  @Column({
    name: 'vegetation_ha',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  vegetationHa!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
