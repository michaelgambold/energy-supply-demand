import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { subDays, subHours, subWeeks } from 'date-fns';
import { DataFact } from '../entities/DataFact.entity';
import { FuelDimension } from '../entities/FuelDimension.entity';
import { PowerDimension } from '../entities/PowerDimension.entity';
import { RegionDimension } from '../entities/RegionDimension.entity';
import { DataService } from './data.service';
import { DataDto } from './dto/data.dto';

type TimeRange =
  | '1Hour'
  | '3Hours'
  | '6Hours'
  | '12Hours'
  | '24Hours'
  | '3Days'
  | '1Week'
  | '2Weeks';

type Period =
  | '1Minute'
  | '5Minutes'
  | '15Minutes'
  | '1Hour'
  | '6Hours'
  | '1Day';

@Controller('api/v1/data')
export class DataController {
  private readonly logger = new Logger(DataController.name);

  constructor(private readonly dataService: DataService) {}

  @Get('/timerange/:timerange/period/:period')
  async findData(
    @Param('timerange') timeRange: TimeRange,
    @Param('period') period: Period,
    @Query('fuel') fuel: string,
    @Query('region') region: string,
    @Query('power') power: string,
  ): Promise<DataDto> {
    if (!timeRange) throw new BadRequestException('Time range cannot be null');
    if (!period) throw new BadRequestException('Period cannot be null');

    const regionId = region && parseInt(region);
    const powerId = power && parseInt(power);
    const fuelId = fuel && parseInt(fuel);

    const endDate = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '1Hour':
        startDate = subHours(endDate, 1);
        break;
      case '3Hours':
        startDate = subHours(endDate, 3);
        break;
      case '6Hours':
        startDate = subHours(endDate, 6);
        break;
      case '12Hours':
        startDate = subHours(endDate, 12);
        break;
      case '24Hours':
        startDate = subHours(endDate, 24);
        break;
      case '3Days':
        startDate = subDays(endDate, 3);
        break;
      case '1Week':
        startDate = subWeeks(endDate, 1);
        break;
      case '2Weeks':
        startDate = subWeeks(endDate, 2);
        break;

      default:
        throw new BadRequestException('Invalid time range');
    }

    const data = await this.dataService.findDataRange({
      startDate,
      endDate,
      regionId,
      fuelId,
      powerId,
    });

    // TODO: re-aggregate the data for different periods

    const dataDto: DataDto = data.reduce(
      (dto: DataDto, df: DataFact) => {
        // add meta data if it does not exist already
        if (!dto.metadata.fuels.includes(df.fuel)) {
          dto.metadata.fuels.push(df.fuel);
        }

        if (!dto.metadata.power.includes(df.power)) {
          dto.metadata.power.push(df.power);
        }

        if (!dto.metadata.regions.includes(df.region)) {
          dto.metadata.regions.push(df.region);
        }

        // add data point
        dto.data.push({
          fuelId: df.fuel.id,
          powerId: df.power.id,
          regionId: df.region.id,
          timestamp: df.timestamp,
          value: df.value,
        });

        return dto;
      },
      {
        metadata: {
          fuels: [],
          regions: [],
          power: [],
        },
        data: [],
      },
    );

    return dataDto;

    // return {
    //   metadata: {
    //     fuels: [], //Array.from(fuels).sort((a, b) => a.name.localeCompare(b.name)),
    //     regions: [], // Array.from(regions).sort((a, b) =>
    //     //   a.name.localeCompare(b.name),
    //     // ),
    //     power: [], //Array.from(power).sort((a, b) => a.name.localeCompare(b.name)),
    //   },
    //   data: dataPoints,
    // };
  }
}
