import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';

@Entity()
export class TimeDimension {
  @PrimaryKey()
  id!: number;

  @Property({ type: types.time })
  time: string;

  @Property()
  quarterOfDay: number;

  @Property()
  halfOfDay: number;

  @Property()
  hour: number;

  @Property()
  quarterOfHour: number;

  @Property()
  twelfthOfHour: number;

  @Property()
  minute: number;
}
