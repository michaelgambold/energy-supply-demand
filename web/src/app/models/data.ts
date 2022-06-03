export interface Data {
  metadata: {
    fuels: Fuel[];
    regions: Region[];
  };
  data: DataPoint[];
}

export interface Fuel {
  id: number;
  name: string;
  type: string;
}

export interface Region {
  id: number;
  name: string;
  abbreviation: string;
  timezone: string;
}

interface DataPoint {
  timestamp: Date;
  value: number;
  fuelId: number;
  regionId: number;
}
