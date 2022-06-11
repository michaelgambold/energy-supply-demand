import { Pipe, PipeTransform } from '@angular/core';
import { StackedBarCategory } from '../components/stacked-bar-chart/stacked-bar-chart.component';
import { Region } from '../models/region';

@Pipe({
  name: 'regionsToStackedBarCategories',
})
export class RegionsToStackedBarCategoriesPipe implements PipeTransform {
  transform(value: Region[], ...args: unknown[]): StackedBarCategory[] {
    return value.map((x) => {
      return { id: x.id, name: x.name };
    });
  }
}
