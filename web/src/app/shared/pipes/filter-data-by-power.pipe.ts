import { Pipe, PipeTransform } from '@angular/core';
import { DataPoint } from '../models/data';

@Pipe({
  name: 'filterDataByPower',
})
export class FilterDataByPowerPipe implements PipeTransform {
  transform(value: DataPoint[], powerId: number): DataPoint[] {
    return value.filter((x) => x.powerId === powerId);
  }
}
