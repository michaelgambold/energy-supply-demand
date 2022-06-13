import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { DateDimension } from '../entities/DateDimension.entity';
import { RegionDimension } from '../entities/RegionDimension.entity';

export class RegionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const item of this.createSeedData()) {
      const date = await em.findOne(DateDimension, { date: item.date });

      // update existing region if found
      if (date) {
        date.dayName = item.dayName;
        date.dayOfMonth = item.dayOfMonth;
        date.dayOfWeek = item.dayOfWeek;
        date.monthNumber = item.monthNumber;
        date.quater = item.quater;
        date.year = item.year;
        return;
      }

      em.create(DateDimension, {
        date: item.date,
        dayName: item.dayName,
        dayOfMonth: item.dayOfMonth,
        dayOfWeek: item.dayOfWeek,
        monthNumber: item.monthNumber,
        quater: item.quater,
        year: item.year,
      });
    }
  }

  private createSeedData(): Partial<DateDimension[]> {
    const seedData: DateDimension[] = [];

    let date = new Date(2020, 1, 1);
    const endDate = new Date(2050, 1, 1);

    while (date < endDate) {
      // seedData.push({
      //   date: new Date(date),
      // });
    }

    console.log(date);

    return seedData;
  }
}
