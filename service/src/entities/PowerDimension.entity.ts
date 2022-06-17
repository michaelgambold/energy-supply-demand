import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class PowerDimension {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  ref: string;

  @Property()
  type: 'generation' | 'demand';
}
