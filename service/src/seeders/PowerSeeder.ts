import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Power } from '../entities/Power.entity';

const seedData: Partial<Power>[] = [
  {
    name: 'Demand',
    ref: 'DemandInputMetadata',
    type: 'demand',
  },
  {
    name: 'Generation',
    ref: 'GenerationInputMetadata',
    type: 'generation',
  },
];

export class PowerSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const item of seedData) {
      const power = await em.findOne(Power, { ref: item.ref });

      // update existing region if found
      if (power) {
        power.name = item.name;
        power.type = item.type;
        return;
      }

      em.create(Power, {
        name: item.name,
        ref: item.ref,
        type: item.type,
      });
    }
  }
}
