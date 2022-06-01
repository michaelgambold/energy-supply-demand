import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Region {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  abbreviation: string;

  @Property()
  ref: string;

  @Property()
  timezone: string;
}
