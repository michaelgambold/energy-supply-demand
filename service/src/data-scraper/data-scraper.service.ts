import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CreateDatumDto } from '../data/dto/create-datum.dto';
import { DataFact } from '../entities/DataFact.entity';
import { Fuel } from '../entities/Fuel.entity';
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

  // @Cron('30 * * * * *')
  @UseRequestContext()
  async scrapeData() {
    this.logger.log('Started scraping data');

    const dataFactRepository = this.orm.em.getRepository(DataFact);
    const fuelRepository = this.orm.em.getRepository(Fuel);
    const regionRepository = this.orm.em.getRepository(Region);

    this.httpService.get<RealTimeFuelData>(this.url).subscribe(async (data) => {
      try {
        const dataPoints: CreateDatumDto[] = [];
        const [fuels, regions] = await Promise.all([
          fuelRepository.findAll(),
          regionRepository.findAll(),
        ]);

        for (const item of data.data.seriesCollection) {
          const fuel = fuels.find((x) => x.ref === item.metadata.fuelType.id);
          const region = regions.find((x) => x.ref === item.metadata.region.id);

          if (!fuel) {
            this.logger.warn('Fuel not found...skipping record');
            continue;
          }

          if (!region) {
            this.logger.warn('Region not found...skipping record');
            continue;
          }

          dataPoints.push({
            fuel,
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
