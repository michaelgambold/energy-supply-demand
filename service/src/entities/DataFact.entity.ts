import {
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { FuelDimension } from './FuelDimension.entity';
import { PowerDimension } from './PowerDimension.entity';
import { RegionDimension } from './RegionDimension.entity';

@Entity()
export class DataFact {
  @PrimaryKey()
  uuid = v4();

  @Index({ name: 'timestamp_index' })
  @Property()
  timestamp: Date;

  @Property()
  value: number;

  @Index({ name: 'fuel_index' })
  @ManyToOne()
  fuel!: FuelDimension;

  @Index({ name: 'region_index' })
  @ManyToOne()
  region!: RegionDimension;

  @Index({ name: 'power_index' })
  @ManyToOne()
  power!: PowerDimension;
}
