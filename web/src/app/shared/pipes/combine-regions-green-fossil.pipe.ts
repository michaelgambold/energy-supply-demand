import { Pipe, PipeTransform } from '@angular/core';
import { Data, DataPoint } from '../models/data';

@Pipe({
  name: 'combineRegionsGreenFossil',
})
export class CombineRegionsGreenFossilPipe implements PipeTransform {
  transform(value: Data, ...args: unknown[]): Data {
    const valuesMap = new Map<
      string,
      { fossil: number; green: number; unknown: number; sum: number }
    >();

    const greenFuel = value.metadata.fuels.find((x) => x.ref === 'green');
    const fossilFuel = value.metadata.fuels.find((x) => x.ref === 'fossil');
    const unknownFuel = value.metadata.fuels.find((x) => x.ref === 'unknown');

    if (!greenFuel || !fossilFuel || !unknownFuel)
      throw new Error('Failed to find fuels');

    for (const dataPoint of value.data) {
      const key = `${dataPoint.timestamp}_${dataPoint.powerId}`;
      let record = valuesMap.get(key);

      if (!record) {
        record = {
          fossil: 0,
          green: 0,
          sum: 0,
          unknown: 0,
        };
      }

      if (dataPoint.fuelId === greenFuel.id) {
        valuesMap.set(key, {
          fossil: record.fossil,
          green: record.green + dataPoint.value,
          sum: record.sum + dataPoint.value,
          unknown: record.unknown,
        });
        continue;
      }

      if (dataPoint.fuelId === fossilFuel.id) {
        valuesMap.set(key, {
          fossil: record.fossil + dataPoint.value,
          green: record.green,
          sum: record.sum + dataPoint.value,
          unknown: record.unknown,
        });
        continue;
      }

      if (dataPoint.fuelId === unknownFuel.id) {
        valuesMap.set(key, {
          fossil: record.fossil,
          green: record.green,
          sum: record.sum + dataPoint.value,
          unknown: record.unknown + dataPoint.value,
        });
        continue;
      }
    }

    const dataPoints: DataPoint[] = [];

    valuesMap.forEach((value, key) => {
      const [timestamp, powerId] = key.split('_');

      dataPoints.push(
        {
          fuelId: greenFuel.id,
          powerId: parseInt(powerId, 10),
          regionId: 0,
          timestamp: timestamp,
          value: (value.green / value.sum) * 100,
        },
        {
          fuelId: fossilFuel.id,
          powerId: parseInt(powerId, 10),
          regionId: 0,
          timestamp: timestamp,
          value: (value.fossil / value.sum) * 100,
        },
        {
          fuelId: unknownFuel.id,
          powerId: parseInt(powerId, 10),
          regionId: 0,
          timestamp: timestamp,
          value: (value.unknown / value.sum) * 100,
        }
      );
    });

    return {
      data: dataPoints,
      endTimestamp: value.endTimestamp,
      metadata: {
        fuels: value.metadata.fuels,
        power: value.metadata.power,
        regions: [],
      },
      recordCount: dataPoints.length,
      startTimestamp: value.startTimestamp,
    };
  }
}
