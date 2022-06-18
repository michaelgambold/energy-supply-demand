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

  /**
   * Find data range with 1 minute data period
   * @param args
   * @returns
   */
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
      value: number;
    }[]
  > {
    this.logger.log('Find data range with 1 minute period');

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

    return qb.execute();
  }
}
