import { Pipe, PipeTransform } from '@angular/core';
import { LineSeries } from '../components/line-chart/line-chart.component';
import { Fuel } from '../models/fuel';

@Pipe({
  name: 'fuelsToLineSeries',
})
export class FuelsToLineSeriesPipe implements PipeTransform {
  transform(value: Fuel[], ...args: unknown[]): LineSeries[] {
    return value.map((x) => {
      return { id: x.id, name: x.name };
    });
  }
}
