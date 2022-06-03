import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { Fuel } from '../entities/Fuel.entity';
import { Region } from '../entities/Region.entity';
import { FuelService } from '../fuel/fuel.service';
import { RegionService } from '../region/region.service';
import { DataService } from './data.service';
import { CreateDatumDto } from './dto/create-datum.dto';
import { DataDto } from './dto/data.dto';
// import { UpdateDatumDto } from './dto/update-datum.dto';

@Controller('api/v1/data')
export class DataController {
  private readonly logger = new Logger(DataController.name);

  constructor(
    private readonly dataService: DataService,
    private readonly fuelService: FuelService,
    private readonly regionService: RegionService,
  ) {}

  // @Post()
  // create(@Body() createDatumDto: CreateDatumDto) {
  //   return this.dataService.create(createDatumDto);
  // }

  @Get()
  async findLatestData(): Promise<DataDto> {
    const data = await this.dataService.findLatestData(500);
    const fuels = new Set<Fuel>();
    const regions = new Set<Region>();
    const dataPoints: {
      fuelId: number;
      regionId: number;
      timestamp: Date;
      value: number;
    }[] = [];

    data.forEach((dataPoint) => {
      fuels.add(dataPoint.fuel);
      regions.add(dataPoint.region);
      dataPoints.push({
        fuelId: dataPoint.fuel.id,
        regionId: dataPoint.region.id,
        timestamp: dataPoint.timestamp,
        value: dataPoint.value,
      });
    });

    return {
      metadata: {
        fuels: Array.from(fuels).sort((a, b) => a.name.localeCompare(b.name)),
        regions: Array.from(regions).sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      },
      data: dataPoints,
    };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dataService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDatumDto: UpdateDatumDto) {
  //   return this.dataService.update(+id, updateDatumDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dataService.remove(+id);
  // }
}
