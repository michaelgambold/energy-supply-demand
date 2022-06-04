import {
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Fuel } from './Fuel.entity';
import { Power } from './Power.entity';
import { Region } from './Region.entity';

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
  fuel!: Fuel;

  @Index({ name: 'region_index' })
  @ManyToOne()
  region!: Region;

  @Index({ name: 'power_index' })
  @ManyToOne()
  power!: Power;
}
