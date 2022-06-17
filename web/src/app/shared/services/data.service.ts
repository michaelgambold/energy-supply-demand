import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../models/data';

export type HistoricDataTimeRange =
  | '1Hour'
  | '3Hours'
  | '6Hours'
  | '12Hours'
  | '24Hours'
  | '3Days'
  | '1Week'
  | '2Weeks';

export type HistoricDataPeriod =
  | '1Minute'
  | '5Minutes'
  | '15Minutes'
  | '1Hour'
  | '6Hours'
  | '1Day';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private readonly http: HttpClient) {}

  getHistoricData(args: {
    timeRange: HistoricDataTimeRange;
    period: HistoricDataPeriod;
    fuelId?: number;
    powerId?: number;
    regionId?: number;
  }): Observable<Data> {
    const urlParams = new URLSearchParams({
      timerange: args.timeRange,
      period: args.period,
    });

    if (args.fuelId) {
      urlParams.append('fuel', args.fuelId.toString());
    }

    if (args.powerId) {
      urlParams.append('power', args.powerId.toString());
    }

    if (args.regionId) {
      urlParams.append('region', args.regionId.toString());
    }

    return this.http.get<Data>(
      `/api/v1/data/timerange/${args.timeRange}/period/${
        args.period
      }?${urlParams.toString()}`
    );
  }
}
