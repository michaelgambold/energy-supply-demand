import { Pipe, PipeTransform } from '@angular/core';
import { LineDataPoint } from '../components/line-chart/line-chart.component';
import { DataPoint } from '../models/data';

@Pipe({
  name: 'dataToLineDataPoints',
})
export class DataToLineDataPointsPipe implements PipeTransform {
  transform(value: DataPoint[], args: Arguments): LineDataPoint[] {
    let dataPoints = value;

    if (args.region) {
      dataPoints = dataPoints.filter((x) => x.regionId === args.region);
    }

    if (args.fuel) {
      dataPoints = dataPoints.filter((x) => x.fuelId === args.fuel);
    }

    return dataPoints.map((x) => {
      const seriesId = args.id === 'fuel' ? x.fuelId : x.regionId;
      console.log(new Date(x.timestamp).valueOf());
      return {
        seriesId,
        unixTimestamp: new Date(x.timestamp).valueOf(),
        value: x.value,
      };
    });
  }
}

interface Arguments {
  id: 'fuel' | 'region';
  fuel?: number;
  region?: number;
}
