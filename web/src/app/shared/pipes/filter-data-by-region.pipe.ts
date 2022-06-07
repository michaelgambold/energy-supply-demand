import { Pipe, PipeTransform } from '@angular/core';
import { DataPoint } from '../models/data';

@Pipe({
  name: 'filterDataByRegion',
})
export class FilterDataByRegionPipe implements PipeTransform {
  transform(value: DataPoint[], regionId: number): DataPoint[] {
    return value.filter((x) => x.regionId === regionId);
  }
}
