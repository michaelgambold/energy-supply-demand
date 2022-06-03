import { Fuel } from './fuel';
import { Region } from './region';

export interface Data {
  metadata: {
    fuels: Fuel[];
    regions: Region[];
  };
  data: DataPoint[];
}

export interface DataPoint {
  timestamp: string;
  value: number;
  fuelId: number;
  regionId: number;
}
