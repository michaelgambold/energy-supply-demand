import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataService } from '../data/data.service';
import { CreateDatumDto } from '../data/dto/create-datum.dto';
import { FuelService } from '../fuel/fuel.service';
import { RegionService } from '../region/region.service';
import { RealTimeFuelData } from './dto/real-time-fuel-data.dto';

@Injectable()
export class DataScraperService {
  private readonly logger = new Logger(DataScraperService.name);
  private readonly url =
    'https://ausrealtimefueltype.global-roam.com/api/SeriesSnapshot?time=';

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private fuelService: FuelService,
    private regionService: RegionService,
  ) {}

  @Cron('30 * * * * *')
  async scrapeData() {
    this.logger.log('Scraping data');
    this.httpService.get<RealTimeFuelData>(this.url).subscribe(async (data) => {
      try {
        const dataPoints: CreateDatumDto[] = [];
        const [fuels, regions] = await Promise.all([
          this.fuelService.findAll(),
          this.regionService.findAll(),
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
          await this.dataService.create(dataPoint);
        }
      } catch (e) {
        this.logger.error('Failed to scrape data');
        this.logger.error(e.message);
      }
    });
  }
}
