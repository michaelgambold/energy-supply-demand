import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { RealTimeFuelData } from './dto/real-time-fuel-data.dto';

@Injectable()
export class DataScraperService {
  private readonly url =
    'https://ausrealtimefueltype.global-roam.com/api/SeriesSnapshot?time=';

  constructor(private httpService: HttpService) {}

  scrapeData(): Observable<AxiosResponse<RealTimeFuelData>> {
    return this.httpService.get<RealTimeFuelData>(this.url);
  }
}
