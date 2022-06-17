import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Logger } from '@nestjs/common';
import { PowerDimension } from '../entities/PowerDimension.entity';

const seedData: Partial<PowerDimension>[] = [
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
  private readonly logger = new Logger(PowerSeeder.name);

  async run(em: EntityManager): Promise<void> {
    this.logger.log('Starting power dimension seed');

    for (const item of seedData) {
      const power = await em.findOne(PowerDimension, { ref: item.ref });

      // update existing region if found
      if (power) {
        power.name = item.name;
        power.type = item.type;
        continue;
      }

      em.create(PowerDimension, {
        name: item.name,
        ref: item.ref,
        type: item.type,
      });
    }

    this.logger.log('Finished power dimension seed');
  }
}
