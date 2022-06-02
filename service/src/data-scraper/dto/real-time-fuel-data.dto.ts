export class RealTimeFuelData {
  timeStamp: string;
  seriesCollection: SeriesCollection[];
}

class SeriesCollection {
  id: string;
  timeStamp: string;
  value: number;
  metadata: {
    region: {
      id: string;
      abbreviation: string;
      name: string;
      order: number;
    };
    fuelType: {
      id: string;
      order: number;
      name: string;
    };
    discriminator: string;
  };
}
