import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { format } from 'date-fns';
import { CreateDatumDto } from '../data/dto/create-datum.dto';
import { DataDto } from '../data/dto/data.dto';
import { DataFact } from '../entities/DataFact.entity';
import { DateDimension } from '../entities/DateDimension.entity';
import { FuelDimension } from '../entities/FuelDimension.entity';
import { PowerDimension } from '../entities/PowerDimension.entity';
import { RegionDimension } from '../entities/RegionDimension.entity';
import { TimeDimension } from '../entities/TimeDimension.entity';
import { RealTimeFuelData } from './dto/real-time-fuel-data.dto';

@Injectable()
export class DataScraperService {
  private readonly logger = new Logger(DataScraperService.name);
  private readonly url =
    'https://ausrealtimefueltype.global-roam.com/api/SeriesSnapshot?time=';

  constructor(
    private readonly httpService: HttpService,
    private readonly orm: MikroORM,
    @InjectQueue('new-data') private readonly newDataQueue: Queue,
  ) {}

  @Cron('30 * * * * *')
  @UseRequestContext()
  async scrapeData() {
    this.logger.log('Started scraping data');

    const dataFactRepository = this.orm.em.getRepository(DataFact);
    const fuelRepository = this.orm.em.getRepository(FuelDimension);
    const regionRepository = this.orm.em.getRepository(RegionDimension);
    const powerRepository = this.orm.em.getRepository(PowerDimension);
    const dateRepository = this.orm.em.getRepository(DateDimension);
    const timeRepository = this.orm.em.getRepository(TimeDimension);

    this.httpService.get<RealTimeFuelData>(this.url).subscribe(async (data) => {
      try {
        const dataPoints: CreateDatumDto[] = [];
        const [fuels, regions, powers] = await Promise.all([
          fuelRepository.findAll(),
          regionRepository.findAll(),
          powerRepository.findAll(),
        ]);

        for (const item of data.data.seriesCollection) {
          const fuel = fuels.find((x) => x.ref === item.metadata.fuelType.id);

          if (!fuel) {
            this.logger.warn(
              `Fuel (${item.metadata.fuelType.id}, ${item.metadata.fuelType.name}) not found...skipping record`,
            );
            continue;
          }

          const region = regions.find((x) => x.ref === item.metadata.region.id);

          if (!region) {
            this.logger.warn(
              `Region (${item.metadata.region.id}, ${item.metadata.region.name}) not found...skipping record`,
            );
            continue;
          }

          const power = powers.find(
            (x) => x.ref === item.metadata.discriminator,
          );

          if (!power) {
            this.logger.warn(
              `Power (${item.metadata.discriminator}) not found...skipping record`,
            );
            continue;
          }

          const itemDate = new Date(item.timeStamp);

          const dateDimension = await dateRepository.findOne({
            year: itemDate.getUTCFullYear(),
            monthNumber: itemDate.getUTCMonth() + 1,
            dayOfMonth: itemDate.getUTCDate(),
          });

          if (!dateDimension) {
            this.logger.warn(
              `Date (${item.timeStamp}) not found...skipping record`,
            );
            continue;
          }

          const timeDimension = await timeRepository.findOne({
            hour: itemDate.getUTCHours(),
            minute: itemDate.getUTCMinutes(),
          });

          if (!timeDimension) {
            this.logger.warn(
              `Time (${item.timeStamp}) not found...skipping record`,
            );
            continue;
          }

          // get previous data point from the database for this series
          // this is NOT a scaleable solution for this as query is done for EVERY data point
          // and may be a long query to find this (depending on database indexing etc)
          const prevDataPoint = await dataFactRepository.findOne({
            fuel,
            region,
            power,
            timestamp: item.timeStamp,
          });

          // skip this point if it already been processed
          if (prevDataPoint) {
            continue;
          }

          dataPoints.push({
            fuel,
            power,
            region,
            timestamp: new Date(item.timeStamp),
            value: item.value,
            date: dateDimension,
            time: timeDimension,
          });
        }

        if (!dataPoints.length) {
          this.logger.log('No new data points to process');
          this.logger.log('Completed scraping data');
          return;
        }

        const createdDataFacts = dataPoints.reduce(
          (dataFacts: DataFact[], dataPoint) => {
            dataFacts.push(dataFactRepository.create(dataPoint));
            return dataFacts;
          },
          [],
        );

        await dataFactRepository.flush();

        this.logger.log(`Inserted ${createdDataFacts.length} new records`);
        this.logger.log('Completed scraping data');

        // emit latest data
        const dataDto = createdDataFacts.reduce(
          (dto: DataDto, dataFact) => {
            if (!dto.metadata.fuels.includes(dataFact.fuel)) {
              dto.metadata.fuels.push(dataFact.fuel);
            }
            if (!dto.metadata.power.includes(dataFact.power)) {
              dto.metadata.power.push(dataFact.power);
            }
            if (!dto.metadata.regions.includes(dataFact.region)) {
              dto.metadata.regions.push(dataFact.region);
            }
            dto.data.push({
              fuelId: dataFact.fuel.id,
              powerId: dataFact.power.id,
              regionId: dataFact.region.id,
              timestamp: dataFact.timestamp,
              value: dataFact.value,
            });

            return dto;
          },
          {
            metadata: {
              fuels: [],
              power: [],
              regions: [],
            },
            data: [],
          },
        );

        this.newDataQueue.add(dataDto);
        this.logger.log('Added latest data to new data queue');
      } catch (e) {
        this.logger.error('Failed to scrape data');
        this.logger.error(e.message);
      }
    });
  }
}
