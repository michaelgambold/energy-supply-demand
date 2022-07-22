import { Pipe, PipeTransform } from '@angular/core';
import { Data, DataPoint } from '../models/data';

@Pipe({
  name: 'combineRegionsGreenFossil',
})
export class CombineRegionsGreenFossilPipe implements PipeTransform {
  transform(value: Data, ...args: unknown[]): Data {
    const dataPointMap = new Map<string, DataPoint[]>();

    const greenFuel = value.metadata.fuels.find((x) => x.ref === 'green');
    const fossilFuel = value.metadata.fuels.find((x) => x.ref === 'fossil');
    const unknownFuel = value.metadata.fuels.find((x) => x.ref === 'unknown');

    if (!greenFuel || !fossilFuel || !unknownFuel)
      throw new Error('Failed to find fuels');

    for (const dataPoint of value.data) {
      const key = `${dataPoint.timestamp}_${dataPoint.powerId}`;

      if (dataPointMap.has(key)) continue;

      const greenDataPoints = value.data.filter(
        (x) =>
          x.timestamp === dataPoint.timestamp &&
          x.powerId === dataPoint.powerId &&
          x.fuelId === greenFuel.id
      );
      const fossilDataPoints = value.data.filter(
        (x) =>
          x.timestamp === dataPoint.timestamp &&
          x.powerId === dataPoint.powerId &&
          x.fuelId === fossilFuel.id
      );
      const unknownDataPoints = value.data.filter(
        (x) =>
          x.timestamp === dataPoint.timestamp &&
          x.powerId === dataPoint.powerId &&
          x.fuelId === unknownFuel.id
      );

      const greenSum = greenDataPoints.length
        ? greenDataPoints.reduce((runningTotal, dataPoint) => {
            return runningTotal + dataPoint.value;
          }, 0)
        : 0;
      const fossilSum = fossilDataPoints.length
        ? fossilDataPoints.reduce((runningTotal, dataPoint) => {
            return runningTotal + dataPoint.value;
          }, 0)
        : 0;
      const unknownSum = unknownDataPoints.length
        ? unknownDataPoints.reduce((runningTotal, dataPoint) => {
            return runningTotal + dataPoint.value;
          }, 0)
        : 0;

      const sum = greenSum + fossilSum + unknownSum;

      dataPointMap.set(key, [
        {
          fuelId: greenFuel.id,
          powerId: dataPoint.powerId,
          regionId: 0,
          timestamp: dataPoint.timestamp,
          value: (greenSum / sum) * 100,
        },
        {
          fuelId: fossilFuel.id,
          powerId: dataPoint.powerId,
          regionId: 0,
          timestamp: dataPoint.timestamp,
          value: (fossilSum / sum) * 100,
        },
        {
          fuelId: unknownFuel.id,
          powerId: dataPoint.powerId,
          regionId: 0,
          timestamp: dataPoint.timestamp,
          value: (unknownSum / sum) * 100,
        },
      ]);
    }

    const dataPointsArray = Array.from(dataPointMap.values()).flat();

    return {
      data: dataPointsArray,
      endTimestamp: value.endTimestamp,
      metadata: {
        fuels: value.metadata.fuels,
        power: value.metadata.power,
        regions: [],
      },
      recordCount: dataPointsArray.length,
      startTimestamp: value.startTimestamp,
    };
  }
}
