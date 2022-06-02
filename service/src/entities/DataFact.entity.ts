import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Fuel } from './Fuel.entity';
import { Region } from './Region.entity';

@Entity()
export class DataFact {
  @PrimaryKey()
  uuid = v4();

  @Property()
  timestamp: Date;

  @Property()
  value: number;

  @ManyToOne()
  fuel!: Fuel;

  @ManyToOne()
  region!: Region;
}
