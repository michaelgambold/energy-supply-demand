import { Entity, Index, PrimaryKey, Property, types } from '@mikro-orm/core';

@Index({
  name: 'date_dimension_year_month_day_idx',
  properties: ['year', 'monthNumber', 'dayOfMonth'],
})
@Entity()
export class DateDimension {
  @PrimaryKey()
  id!: number;

  @Property({ type: types.date })
  date: Date;

  @Property()
  year: number;

  @Property()
  quarter: number;

  @Property()
  weekOfYear: number;

  @Property()
  monthNumber: number;

  @Property()
  dayOfMonth: number;

  @Property()
  dayOfWeek: number;

  @Property()
  dayName: string;
}
