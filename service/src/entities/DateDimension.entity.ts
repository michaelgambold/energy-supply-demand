import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';

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
