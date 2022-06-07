import { Pipe, PipeTransform } from '@angular/core';
import { LineDataPoint } from '../components/line-chart/line-chart.component';
import { DataPoint } from '../models/data';

@Pipe({
  name: 'dataToLineDataPoints',
})
export class DataToLineDataPointsPipe implements PipeTransform {
  transform(value: DataPoint[], id: 'fuel' | 'region'): LineDataPoint[] {
    return value.map((x) => {
      const seriesId = id === 'fuel' ? x.fuelId : x.regionId;
      console.log(new Date(x.timestamp).valueOf());
      return {
        seriesId,
        unixTimestamp: new Date(x.timestamp).valueOf(),
        value: x.value,
      };
    });
  }
}
