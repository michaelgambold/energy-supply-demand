import { Entity, Index, PrimaryKey, Property, types } from '@mikro-orm/core';

@Index({
  name: 'time_dimension_hour_minute_idx',
  properties: ['hour', 'minute'],
})
@Index({
  name: 'time_dimension_hour_quarter_of_hour_idx',
  properties: ['hour', 'quarterOfHour'],
})
@Entity()
export class TimeDimension {
  @PrimaryKey()
  id!: number;

  @Property({ type: types.time })
  time: string;

  @Index({ name: 'time_dimension_quarter_of_day_idx' })
  @Property()
  quarterOfDay: number;

  @Property()
  halfOfDay: number;

  @Index({ name: 'time_dimension_hour_idx' })
  @Property()
  hour: number;

  @Property()
  quarterOfHour: number;

  @Property()
  twelfthOfHour: number;

  @Property()
  minute: number;
}
