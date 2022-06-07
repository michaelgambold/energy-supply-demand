export class DataDto {
  metadata: {
    fuels: Fuel[];
    regions: Region[];
    power: Power[];
  };
  data: DataPoint[];
}

class Fuel {
  id: number;
  name: string;
  type: 'green' | 'fossil' | 'unknown';
}

class Region {
  id: number;
  name: string;
  abbreviation: string;
  timezone: string;
}

class Power {
  id: number;
  name: string;
  type: 'generation' | 'demand';
}

class DataPoint {
  timestamp: Date;
  value: number;
  fuelId: number;
  regionId: number;
  powerId: number;
}
