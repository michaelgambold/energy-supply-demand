import { Pipe, PipeTransform } from '@angular/core';
import { LineDataPoint } from '../components/line-chart/line-chart.component';
import { Data } from '../models/data';

@Pipe({
  name: 'dataToGreenFossilLineDataPoints',
})
export class DataToGreenFossilLineDataPointsPipe implements PipeTransform {
  transform(value: Data): LineDataPoint[] {
    const greenFuelIds = value.metadata.fuels
      .filter((x) => x.type === 'green')
      .map((x) => x.id);
    const fossilFuelIds = value.metadata.fuels
      .filter((x) => x.type === 'fossil')
      .map((x) => x.id);
    const unknownFuelIds = value.metadata.fuels
      .filter((x) => x.type === 'unknown')
      .map((x) => x.id);

    const dataPointMap = new Map<string, LineDataPoint>();

    for (const dp of value.data) {
      if (greenFuelIds.includes(dp.fuelId)) {
        this.addValueToMap(dataPointMap, dp.timestamp, 'green', dp.value);
      } else if (fossilFuelIds.includes(dp.fuelId)) {
        this.addValueToMap(dataPointMap, dp.timestamp, 'fossil', dp.value);
      } else if (unknownFuelIds.includes(dp.fuelId)) {
        this.addValueToMap(dataPointMap, dp.timestamp, 'unknown', dp.value);
      } else {
        continue;
      }
    }

    return Array.from(dataPointMap.values());
  }

  addValueToMap(
    dataPointMap: Map<string, LineDataPoint>,
    timestamp: string,
    type: 'green' | 'fossil' | 'unknown',
    value: number
  ) {
    const key = `${timestamp}-${type}`;
    const lineDataPoint = dataPointMap.get(key);
    dataPointMap.set(key, {
      seriesId: type,
      unixTimestamp: new Date(timestamp).valueOf(),
      value: lineDataPoint ? lineDataPoint.value + value : value,
    });
  }
}
