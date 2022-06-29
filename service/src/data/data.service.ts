import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { DataFact } from '../entities/DataFact.entity';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    @InjectRepository(DataFact)
    private dataFactRepository: EntityRepository<DataFact>,
  ) {}

  async findDataRange1MinutePeriod(args: {
    startDate: Date;
    endDate: Date;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }): Promise<
    {
      uuid: string;
      timestamp: Date;
      value: number;
      fuel: number;
      region: number;
      power: number;
      date: number;
      time: number;
    }[]
  > {
    this.logger.log('Find data range with 1 minute period');

    const qb = this.dataFactRepository
      .qb()
      .select('*')
      .where({ timestamp: { $gte: args.startDate } })
      .andWhere({ timestamp: { $lte: args.endDate } });

    if (args.fuelId) {
      qb.andWhere({ fuel: args.fuelId });
    }

    if (args.powerId) {
      qb.andWhere({ power: args.powerId });
    }

    if (args.regionId) {
      qb.andWhere({ region: args.regionId });
    }

    qb.orderBy({ timestamp: QueryOrder.ASC });

    return qb.execute();
  }

  async findDataRange5MinutePeriod(args: {
    startDate: Date;
    endDate: Date;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }): Promise<
    {
      year: number;
      monthNumber: number;
      dayOfMonth: number;
      hour: number;
      twelfthOfHour: number;
      fuelId: number;
      regionId: number;
      powerId: number;
      timestamp: Date;
      value: string;
    }[]
  > {
    this.logger.log('Find data range with 5 minute period');

    const qb = this.dataFactRepository
      .qb('df')
      .select([
        'dd.year as year',
        'dd.month_number as monthNumber',
        'dd.day_of_month as dayOfMonth',
        'td.hour as hour',
        'td.twelfth_of_hour as twelfthOfHour',
        'df.fuel_id as fuelId',
        'df.region_id as regionId',
        'df.power_id as powerId',
        'min(timestamp) as timestamp',
        'avg(value) as value',
      ])
      .join('df.date', 'dd')
      .join('df.time', 'td')
      .where({ timestamp: { $gte: args.startDate } })
      .andWhere({ timestamp: { $lte: args.endDate } })
      .groupBy([
        'dd.year',
        'dd.month_number',
        'dd.day_of_month',
        'td.hour',
        'td.twelfth_of_hour',
        'df.fuel_id',
        'df.region_id',
        'df.power_id',
      ])
      .orderBy([
        { date: { year: QueryOrder.ASC } },
        { date: { monthNumber: QueryOrder.ASC } },
        { date: { dayOfMonth: QueryOrder.ASC } },
        { time: { hour: QueryOrder.ASC } },
        { time: { twelfthOfHour: QueryOrder.ASC } },
      ]);

    if (args.fuelId) {
      qb.andWhere({ fuel: args.fuelId });
    }

    if (args.powerId) {
      qb.andWhere({ power: args.powerId });
    }

    if (args.regionId) {
      qb.andWhere({ region: args.regionId });
    }

    return qb.execute();
  }

  async findDataRange15MinutePeriod(args: {
    startDate: Date;
    endDate: Date;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }): Promise<
    {
      year: number;
      monthNumber: number;
      dayOfMonth: number;
      hour: number;
      quarterOfHour: number;
      fuelId: number;
      regionId: number;
      powerId: number;
      timestamp: Date;
      value: string;
    }[]
  > {
    this.logger.log('Find data range with 15 minute period');

    const qb = this.dataFactRepository
      .qb('df')
      .select([
        'dd.year as year',
        'dd.month_number as monthNumber',
        'dd.day_of_month as dayOfMonth',
        'td.hour as hour',
        'td.quarter_of_hour as quarterOfHour',
        'df.fuel_id as fuelId',
        'df.region_id as regionId',
        'df.power_id as powerId',
        'min(timestamp) as timestamp',
        'avg(value) as value',
      ])
      .join('df.date', 'dd')
      .join('df.time', 'td')
      .where({ timestamp: { $gte: args.startDate } })
      .andWhere({ timestamp: { $lte: args.endDate } })
      .groupBy([
        'dd.year',
        'dd.month_number',
        'dd.day_of_month',
        'td.hour',
        'td.quarter_of_hour',
        'df.fuel_id',
        'df.region_id',
        'df.power_id',
      ])
      .orderBy([
        { date: { year: QueryOrder.ASC } },
        { date: { monthNumber: QueryOrder.ASC } },
        { date: { dayOfMonth: QueryOrder.ASC } },
        { time: { hour: QueryOrder.ASC } },
        { time: { quarterOfHour: QueryOrder.ASC } },
      ]);

    if (args.fuelId) {
      qb.andWhere({ fuel: args.fuelId });
    }

    if (args.powerId) {
      qb.andWhere({ power: args.powerId });
    }

    if (args.regionId) {
      qb.andWhere({ region: args.regionId });
    }

    return qb.execute();
  }

  async findDataRange1HourPeriod(args: {
    startDate: Date;
    endDate: Date;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }): Promise<
    {
      year: number;
      monthNumber: number;
      dayOfMonth: number;
      hour: number;
      fuelId: number;
      regionId: number;
      powerId: number;
      timestamp: Date;
      value: string;
    }[]
  > {
    this.logger.log('Find data range with 1 hour period');

    const qb = this.dataFactRepository
      .qb('df')
      .select([
        'dd.year as year',
        'dd.month_number as monthNumber',
        'dd.day_of_month as dayOfMonth',
        'td.hour as hour',
        'df.fuel_id as fuelId',
        'df.region_id as regionId',
        'df.power_id as powerId',
        'min(timestamp) as timestamp',
        'avg(value) as value',
      ])
      .join('df.date', 'dd')
      .join('df.time', 'td')
      .where({ timestamp: { $gte: args.startDate } })
      .andWhere({ timestamp: { $lte: args.endDate } })
      .groupBy([
        'dd.year',
        'dd.month_number',
        'dd.day_of_month',
        'td.hour',
        'df.fuel_id',
        'df.region_id',
        'df.power_id',
      ])
      .orderBy([
        { date: { year: QueryOrder.ASC } },
        { date: { monthNumber: QueryOrder.ASC } },
        { date: { dayOfMonth: QueryOrder.ASC } },
        { time: { hour: QueryOrder.ASC } },
      ]);

    if (args.fuelId) {
      qb.andWhere({ fuel: args.fuelId });
    }

    if (args.powerId) {
      qb.andWhere({ power: args.powerId });
    }

    if (args.regionId) {
      qb.andWhere({ region: args.regionId });
    }

    return qb.execute();
  }

  async findDataRange6HourPeriod(args: {
    startDate: Date;
    endDate: Date;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }): Promise<
    {
      year: number;
      monthNumber: number;
      dayOfMonth: number;
      quaterOfHour: number;
      fuelId: number;
      regionId: number;
      powerId: number;
      timestamp: Date;
      value: string;
    }[]
  > {
    this.logger.log('Find data range with 6 hour period');

    const qb = this.dataFactRepository
      .qb('df')
      .select([
        'dd.year as year',
        'dd.month_number as monthNumber',
        'dd.day_of_month as dayOfMonth',
        'td.quarter_of_day as quarterOfDay',
        'df.fuel_id as fuelId',
        'df.region_id as regionId',
        'df.power_id as powerId',
        'min(timestamp) as timestamp',
        'avg(value) as value',
      ])
      .join('df.date', 'dd')
      .join('df.time', 'td')
      .where({ timestamp: { $gte: args.startDate } })
      .andWhere({ timestamp: { $lte: args.endDate } })
      .groupBy([
        'dd.year',
        'dd.month_number',
        'dd.day_of_month',
        'td.quarter_of_day',
        'df.fuel_id',
        'df.region_id',
        'df.power_id',
      ])
      .orderBy([
        { date: { year: QueryOrder.ASC } },
        { date: { monthNumber: QueryOrder.ASC } },
        { date: { dayOfMonth: QueryOrder.ASC } },
        { time: { quarterOfDay: QueryOrder.ASC } },
      ]);

    if (args.fuelId) {
      qb.andWhere({ fuel: args.fuelId });
    }

    if (args.powerId) {
      qb.andWhere({ power: args.powerId });
    }

    if (args.regionId) {
      qb.andWhere({ region: args.regionId });
    }

    return qb.execute();
  }

  async findDataRange1DayPeriod(args: {
    startDate: Date;
    endDate: Date;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }): Promise<
    {
      year: number;
      monthNumber: number;
      dayOfMonth: number;
      fuelId: number;
      regionId: number;
      powerId: number;
      timestamp: Date;
      value: string;
    }[]
  > {
    this.logger.log('Find data range with 1 day period');

    const qb = this.dataFactRepository
      .qb('df')
      .select([
        'dd.year as year',
        'dd.month_number as monthNumber',
        'dd.day_of_month as dayOfMonth',
        'df.fuel_id as fuelId',
        'df.region_id as regionId',
        'df.power_id as powerId',
        'min(timestamp) as timestamp',
        'avg(value) as value',
      ])
      .join('df.date', 'dd')
      .where({ timestamp: { $gte: args.startDate } })
      .andWhere({ timestamp: { $lte: args.endDate } })
      .groupBy([
        'dd.year',
        'dd.month_number',
        'dd.day_of_month',
        'df.fuel_id',
        'df.region_id',
        'df.power_id',
      ])
      .orderBy([
        { date: { year: QueryOrder.ASC } },
        { date: { monthNumber: QueryOrder.ASC } },
        { date: { dayOfMonth: QueryOrder.ASC } },
      ]);

    if (args.fuelId) {
      qb.andWhere({ fuel: args.fuelId });
    }

    if (args.powerId) {
      qb.andWhere({ power: args.powerId });
    }

    if (args.regionId) {
      qb.andWhere({ region: args.regionId });
    }

    return qb.execute();
  }
}
