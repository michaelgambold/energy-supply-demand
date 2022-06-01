import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Region } from '../entities/Region.entity';

const seedData: Partial<Region>[] = [
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
  async run(em: EntityManager): Promise<void> {
    for (const item of seedData) {
      const region = await em.findOne(Region, { ref: item.ref });

      // update existing region if found
      if (region) {
        region.abbreviation = item.abbreviation;
        region.name = item.name;
        region.timezone = item.timezone;
        region;
      }

      em.create(Region, {
        abbreviation: item.abbreviation,
        name: item.name,
        ref: item.ref,
        timezone: item.timezone,
      });
    }
  }
}
