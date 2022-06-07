import { Pipe, PipeTransform } from '@angular/core';
import { DataPoint } from '../models/data';

@Pipe({
  name: 'filterDataByFuel',
})
export class FilterDataByFuelPipe implements PipeTransform {
  transform(value: DataPoint[], fuelId: number): DataPoint[] {
    return value.filter((x) => x.fuelId === fuelId);
  }
}
