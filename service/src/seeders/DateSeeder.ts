import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Logger } from '@nestjs/common';
import {
  addDays,
  getDate,
  getDay,
  getISODay,
  getMonth,
  getQuarter,
  getWeek,
  getWeekYear,
  getYear,
} from 'date-fns';
import { DateDimension } from '../entities/DateDimension.entity';

export class DateSeeder extends Seeder {
  private readonly logger = new Logger(DateSeeder.name);

  async run(em: EntityManager): Promise<void> {
    this.logger.log('Starting date dimension seed');

    for (const item of this.createSeedData()) {
      const date = await em.findOne(DateDimension, { date: item.date });

      // update existing region if found
      if (date) {
        date.dayName = item.dayName;
        date.dayOfMonth = item.dayOfMonth;
        date.dayOfWeek = item.dayOfWeek;
        date.monthNumber = item.monthNumber;
        date.quarter = item.quarter;
        date.weekOfYear = item.weekOfYear;
        date.year = item.year;
        continue;
      }

      em.create(DateDimension, {
        date: item.date,
        dayName: item.dayName,
        dayOfMonth: item.dayOfMonth,
        dayOfWeek: item.dayOfWeek,
        monthNumber: item.monthNumber,
        quarter: item.quarter,
        year: item.year,
        weekOfYear: item.weekOfYear,
      });
    }

    this.logger.log('Finished date dimension seed');
  }

  private createSeedData(): Partial<DateDimension>[] {
    const seedData: Partial<DateDimension>[] = [];
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let date = new Date(Date.UTC(2022, 5, 13));
    const endDate = new Date(Date.UTC(2022, 6, 1));

    while (date < endDate) {
      seedData.push({
        date: new Date(date),
        dayName: daysOfWeek[getDay(date)],
        dayOfMonth: getDate(date),
        dayOfWeek: getISODay(date),
        monthNumber: getMonth(date) + 1,
        quarter: getQuarter(date),
        year: getYear(date),
        weekOfYear: getWeek(date),
      });

      date = addDays(date, 1);
    }

    return seedData;
  }
}
