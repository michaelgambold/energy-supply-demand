import { Pipe, PipeTransform } from '@angular/core';
import { Data, DataPoint } from '../models/data';

@Pipe({
  name: 'combineRegions',
})
export class CombineRegionsPipe implements PipeTransform {
  transform(value: Data, ...args: unknown[]): Data {
    const dataPointMap: Map<string, DataPoint> = value.data.reduce(
      (dataPointMap, dataPoint) => {
        const key = `${dataPoint.timestamp}_${dataPoint.fuelId}_${dataPoint.powerId}`;
        const dp = dataPointMap.get(key);

        if (dp) {
          dataPointMap.set(key, { ...dp, value: dp.value + dataPoint.value });
        } else {
          dataPointMap.set(key, {
            fuelId: dataPoint.fuelId,
            powerId: dataPoint.powerId,
            regionId: 0,
            timestamp: dataPoint.timestamp,
            value: dataPoint.value,
          });
        }

        return dataPointMap;
      },
      new Map<string, DataPoint>()
    );

    const sortedDataPoints = Array.from(dataPointMap.values()).sort((a, b) => {
      if (new Date(a.timestamp).valueOf() < new Date(b.timestamp).valueOf())
        return -1;
      if (new Date(a.timestamp).valueOf() > new Date(b.timestamp).valueOf())
        return 1;
      return 0;
    });

    const data: Data = {
      startTimestamp: value.startTimestamp,
      endTimestamp: value.endTimestamp,
      recordCount: sortedDataPoints.length,
      metadata: {
        fuels: value.metadata.fuels,
        power: value.metadata.power,
        regions: [],
      },
      data: sortedDataPoints,
    };

    return data;
  }
}
