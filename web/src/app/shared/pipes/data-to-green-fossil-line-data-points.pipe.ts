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

    const dataPoints: LineDataPoint[] = [];

    for (const dp of value.data) {
      let ldp: LineDataPoint | undefined;

      if (greenFuelIds.includes(dp.fuelId)) {
        ldp = this.createOrFindLineDataPoint(dataPoints, dp.timestamp, 'green');
      } else if (fossilFuelIds.includes(dp.fuelId)) {
        ldp = this.createOrFindLineDataPoint(
          dataPoints,
          dp.timestamp,
          'fossil'
        );
      } else if (unknownFuelIds.includes(dp.fuelId)) {
        ldp = this.createOrFindLineDataPoint(
          dataPoints,
          dp.timestamp,
          'unknown'
        );
      } else {
        continue;
      }

      ldp.value += dp.value;
    }

    return dataPoints;
  }

  createOrFindLineDataPoint(
    dataPoints: LineDataPoint[],
    timestamp: string,
    type: 'green' | 'fossil' | 'unknown'
  ) {
    let dp = dataPoints.find(
      (x) =>
        x.unixTimestamp === new Date(timestamp).valueOf() && x.seriesId === type
    );

    if (dp) {
      return dp;
    }

    dp = {
      seriesId: type,
      unixTimestamp: new Date(timestamp).valueOf(),
      value: 0,
    };

    dataPoints.push(dp);

    return dp;
  }
}
