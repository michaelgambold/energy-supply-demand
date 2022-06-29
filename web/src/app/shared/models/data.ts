import { Fuel } from './fuel';
import { Power } from './power';
import { Region } from './region';

export interface Data {
  startTimestamp: string;
  endTimestamp: string;
  recordCount: number;
  metadata: {
    fuels: Fuel[];
    power: Power[];
    regions: Region[];
  };
  data: DataPoint[];
}

export interface DataPoint {
  timestamp: string;
  value: number;
  fuelId: number;
  regionId: number;
  powerId: number;
}
