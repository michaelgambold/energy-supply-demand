import {
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { DateDimension } from './DateDimension.entity';
import { FuelDimension } from './FuelDimension.entity';
import { PowerDimension } from './PowerDimension.entity';
import { RegionDimension } from './RegionDimension.entity';
import { TimeDimension } from './TimeDimension.entity';

@Index({
  name: 'data_fact_dimensions_idx',
  properties: ['fuel', 'region', 'power', 'date', 'time'],
})
@Index({
  name: 'data_fact_date_time_idx',
  properties: ['date', 'time'],
})
@Entity()
export class DataFact {
  @PrimaryKey()
  uuid = v4();

  @Index({ name: 'data_fact_timestamp_idx' })
  @Property()
  timestamp: Date;

  @Property()
  value: number;

  @Index({ name: 'data_fact_fuel_idx' })
  @ManyToOne()
  fuel!: FuelDimension;

  @Index({ name: 'data_fact_region_idx' })
  @ManyToOne()
  region!: RegionDimension;

  @Index({ name: 'data_fact_power_idx' })
  @ManyToOne()
  power!: PowerDimension;

  @Index({ name: 'data_fact_date_idx' })
  @ManyToOne()
  date!: DateDimension;

  @Index({ name: 'data_fact_time_idx' })
  @ManyToOne()
  time!: TimeDimension;
}
