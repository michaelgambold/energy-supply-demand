import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Logger } from '@nestjs/common';
import { addMinutes, format, getHours, getMinutes } from 'date-fns';
import { TimeDimension } from '../entities/TimeDimension.entity';

export class TimeSeeder extends Seeder {
  private readonly logger = new Logger(TimeSeeder.name);

  async run(em: EntityManager): Promise<void> {
    this.logger.log('Starting time dimension seed');

    const timeDimensions = await em.find(TimeDimension, {});
    const timeDimensionMap = new Map(
      timeDimensions.map((x) => {
        return [x.time, x];
      }),
    );

    for (const item of this.createSeedData()) {
      const time = timeDimensionMap.get(item.time);

      // update existing region if found
      if (time) {
        time.halfOfDay = item.halfOfDay;
        time.hour = item.hour;
        time.minute = item.minute;
        time.quarterOfDay = item.quarterOfDay;
        time.quarterOfHour = item.quarterOfHour;
        time.time = item.time;
        time.twelfthOfHour = item.twelfthOfHour;
        continue;
      }

      em.create(TimeDimension, {
        halfOfDay: item.halfOfDay,
        hour: item.hour,
        minute: item.minute,
        quarterOfDay: item.quarterOfDay,
        quarterOfHour: item.quarterOfHour,
        time: item.time,
        twelfthOfHour: item.twelfthOfHour,
      });
    }

    this.logger.log('Finished time dimension seed');
  }

  private createSeedData(): Partial<TimeDimension>[] {
    const seedData: Partial<TimeDimension>[] = [];

    let date = new Date(0, 0, 1, 0, 0, 0);
    const endDate = new Date(0, 0, 2, 0, 0);

    while (date < endDate) {
      seedData.push({
        time: format(date, 'HH:mm:ss'),
        halfOfDay: getHours(date) < 12 ? 1 : 2,
        hour: getHours(date),
        minute: getMinutes(date),
        quarterOfDay: this.getQuarterOfDay(date),
        quarterOfHour: this.getQuaterOfHour(date),
        twelfthOfHour: this.getTwelthOfHour(date),
      });

      date = addMinutes(date, 1);
    }

    return seedData;
  }

  private getQuarterOfDay(date: Date): number {
    const quarter = Math.floor(date.getHours() / 6);
    return quarter + 1;
  }

  private getQuaterOfHour(date: Date): number {
    const quarter = Math.floor(date.getMinutes() / 15);
    return quarter + 1;
  }

  private getTwelthOfHour(date: Date): number {
    const twelth = Math.floor(date.getMinutes() / 5);
    return twelth + 1;
  }
}
