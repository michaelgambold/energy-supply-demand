import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CreateDatumDto } from '../data/dto/create-datum.dto';
import { DataFact } from '../entities/DataFact.entity';
import { Fuel } from '../entities/Fuel.entity';
import { Power } from '../entities/Power.entity';
import { Region } from '../entities/Region.entity';
import { RealTimeFuelData } from './dto/real-time-fuel-data.dto';

@Injectable()
export class DataScraperService {
  private readonly logger = new Logger(DataScraperService.name);
  private readonly url =
    'https://ausrealtimefueltype.global-roam.com/api/SeriesSnapshot?time=';

  constructor(
    private readonly httpService: HttpService,
    private readonly orm: MikroORM,
  ) {}

  @Cron('30,40 * * * * *')
  @UseRequestContext()
  async scrapeData() {
    this.logger.log('Started scraping data');

    const dataFactRepository = this.orm.em.getRepository(DataFact);
    const fuelRepository = this.orm.em.getRepository(Fuel);
    const regionRepository = this.orm.em.getRepository(Region);
    const powerRepository = this.orm.em.getRepository(Power);

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
          });
        }

        for (const dataPoint of dataPoints) {
          dataFactRepository.create(dataPoint);
        }
        await dataFactRepository.flush();
        this.logger.log('Completed scraping data');
      } catch (e) {
        this.logger.error('Failed to scrape data');
        this.logger.error(e.message);
      }
    });
  }
}
