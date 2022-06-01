import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Fuel } from '../entities/Fuel.entity';

const seedData: Partial<Fuel>[] = [
  {
    name: 'Battery Storage',
    ref: 'Battery Storage',
    type: 'green',
  },
  {
    name: 'Black Coal',
    ref: 'Black Coal',
    type: 'fossil',
  },
  {
    name: 'Brown Coal',
    ref: 'Brown Coal',
    type: 'fossil',
  },
  {
    name: "Demand (The AEMO don't see)",
    ref: 'DemandAemoCanNotSee',
    type: 'unknown',
  },
  {
    name: 'Demand (AEMO Operational)',
    ref: 'Operational Demand',
    type: 'unknown',
  },
  {
    name: 'Gas',
    ref: 'Gas',
    type: 'fossil',
  },
  {
    name: 'Hydro',
    ref: 'Hydro',
    type: 'green',
  },
  {
    name: 'Large Solar',
    ref: 'Large Solar',
    type: 'green',
  },
  {
    name: 'Liquid Fuel',
    ref: 'Liquid Fuel',
    type: 'fossil',
  },
  {
    name: 'Other',
    ref: 'Other',
    type: 'unknown',
  },
  {
    name: 'Small Solar',
    ref: 'Small Solar',
    type: 'green',
  },
  {
    name: 'Wind',
    ref: 'Wind',
    type: 'green',
  },
];

export class FuelSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const item of seedData) {
      const fuel = await em.findOne(Fuel, { ref: item.ref });

      // update existing record
      if (fuel) {
        fuel.name = item.name;
        fuel.type = item.type;
        return;
      }

      em.create(Fuel, {
        name: item.name,
        ref: item.ref,
        type: item.type,
      });
    }
  }
}
