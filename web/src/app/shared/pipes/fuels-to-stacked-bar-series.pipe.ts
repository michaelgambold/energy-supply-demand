import { Pipe, PipeTransform } from '@angular/core';
import { StackedBarSeries } from '../components/stacked-bar-chart/stacked-bar-chart.component';
import { Fuel } from '../models/fuel';

@Pipe({
  name: 'fuelsToStackedBarSeries',
})
export class FuelsToStackedBarSeriesPipe implements PipeTransform {
  transform(value: Fuel[], ...args: unknown[]): StackedBarSeries[] {
    return value.map((x) => {
      return { id: x.id, name: x.name };
    });
  }
}
