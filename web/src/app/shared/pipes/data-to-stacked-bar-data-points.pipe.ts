import { Pipe, PipeTransform } from '@angular/core';
import { StackedBarDataPoint } from '../components/stacked-bar-chart/stacked-bar-chart.component';

import { DataPoint } from '../models/data';

@Pipe({
  name: 'dataToStackedBarDataPoints',
})
export class DataToStackedBarDataPointsPipe implements PipeTransform {
  transform(
    value: DataPoint[],
    args: {
      categoryId: 'fuel' | 'region';
      seriesId: 'fuel' | 'region';
    }
  ): StackedBarDataPoint[] {
    return value.map((x) => {
      const categoryId = args.categoryId === 'fuel' ? x.fuelId : x.regionId;
      const seriesId = args.seriesId === 'fuel' ? x.fuelId : x.regionId;
      return {
        categoryId,
        seriesId,
        value: x.value,
      };
    });
  }
}
