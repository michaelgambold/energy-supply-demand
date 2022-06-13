import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Logger } from '@nestjs/common';
import { RegionDimension } from '../entities/RegionDimension.entity';

const seedData: Partial<RegionDimension>[] = [
  {
    name: 'New South Wales',
    abbreviation: 'NSW',
    ref: 'NSW',
    timezone: 'Australia/Sydney',
  },
  {
    name: 'Queensland',
    abbreviation: 'QLD',
    ref: 'QLD',
    timezone: 'Australia/Brisbane',
  },
  {
    name: 'South Australia',
    abbreviation: 'SA',
    ref: 'SA',
    timezone: 'Australia/Adelaide',
  },
  {
    name: 'Tasmania',
    abbreviation: 'TAS',
    ref: 'TAS',
    timezone: 'Australia/Hobart',
  },
  {
    name: 'Victoria',
    abbreviation: 'VIC',
    ref: 'VIC',
    timezone: 'Australia/Melbourne',
  },
  {
    name: 'Western Australia',
    abbreviation: 'WA',
    ref: 'WA',
    timezone: 'Australia/Perth',
  },
];

export class RegionSeeder extends Seeder {
  private readonly logger = new Logger(RegionSeeder.name);

  async run(em: EntityManager): Promise<void> {
    this.logger.log('Starting region dimension seed');

    for (const item of seedData) {
      const region = await em.findOne(RegionDimension, { ref: item.ref });

      // update existing region if found
      if (region) {
        region.abbreviation = item.abbreviation;
        region.name = item.name;
        region.timezone = item.timezone;
        continue;
      }

      em.create(RegionDimension, {
        abbreviation: item.abbreviation,
        name: item.name,
        ref: item.ref,
        timezone: item.timezone,
      });
    }

    this.logger.log('Finished region dimension seed');
  }
}
