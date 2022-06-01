import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Fuel {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  ref: string;

  @Property()
  type: 'green' | 'fossil' | 'unknown';
}
