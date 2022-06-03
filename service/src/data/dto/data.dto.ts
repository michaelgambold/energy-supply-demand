export class DataDto {
  metadata: {
    fuels: Fuel[];
    regions: Region[];
  };
  data: DataPoint[];
}

class Fuel {
  id: number;
  name: string;
  type: string;
}

class Region {
  id: number;
  name: string;
  abbreviation: string;
  timezone: string;
}

class DataPoint {
  timestamp: Date;
  value: number;
  fuelId: number;
  regionId: number;
}
