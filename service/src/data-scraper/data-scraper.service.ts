import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RealTimeFuelData } from './dto/real-time-fuel-data.dto';

@Injectable()
export class DataScraperService {
  private readonly url =
    'https://ausrealtimefueltype.global-roam.com/api/SeriesSnapshot?time=';

  constructor(private httpService: HttpService) {}

  @Cron('30 * * * * *')
  scrapeData() {
    this.httpService.get<RealTimeFuelData>(this.url).subscribe((data) => {
      console.log(data);
    });
  }
}
