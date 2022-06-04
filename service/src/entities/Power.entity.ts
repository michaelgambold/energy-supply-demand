import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Power {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  ref: string;

  @Property()
  type: 'generation' | 'demand';
}
