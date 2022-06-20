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
import { FuelService } from '../fuel/fuel.service';
import { PowerService } from '../power/power.service';
import { RegionService } from '../region/region.service';
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

  constructor(
    private readonly dataService: DataService,
    private readonly fuelService: FuelService,
    private readonly powerService: PowerService,
    private readonly regionService: RegionService,
  ) {}

  @Get('/timerange/:timerange/period/:period')
  async findData(
    @Param('timerange') timeRange: TimeRange,
    @Param('period') period: Period,
    @Query('fuel') fuel: string,
    @Query('region') region: string,
    @Query('power') power: string,
  ) {
    if (!timeRange) throw new BadRequestException('Time range cannot be null');
    if (!period) throw new BadRequestException('Period cannot be null');

    const [fuels, regions, powers] = await Promise.all([
      this.fuelService.findAll(),
      this.regionService.findAll(),
      this.powerService.findAll(),
    ]);

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

    const mapToDto = (
      input: {
        fuelId: number;
        regionId: number;
        powerId: number;
        timestamp: Date;
        value: number | string;
      }[],
    ): DataDto => {
      const dataDto: DataDto = input.reduce(
        (dto: DataDto, input) => {
          const f = fuels.find((x) => x.id === input.fuelId);
          const r = regions.find((x) => x.id === input.regionId);
          const p = powers.find((x) => x.id === input.powerId);

          // add meta data if it does not exist already
          if (!dto.metadata.fuels.includes(f)) {
            dto.metadata.fuels.push(f);
          }

          if (!dto.metadata.power.includes(p)) {
            dto.metadata.power.push(p);
          }

          if (!dto.metadata.regions.includes(r)) {
            dto.metadata.regions.push(r);
          }

          // add data point
          dto.data.push({
            fuelId: input.fuelId,
            powerId: input.powerId,
            regionId: input.regionId,
            timestamp: input.timestamp,
            value:
              typeof input.value === 'string'
                ? parseFloat(input.value)
                : input.value,
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
    };

    switch (period) {
      case '1Minute':
        const oneMinData = (
          await this.dataService.findDataRange1MinutePeriod({
            startDate,
            endDate,
            regionId,
            fuelId,
            powerId,
          })
        ).map((x) => {
          return {
            fuelId: x.fuel,
            regionId: x.region,
            powerId: x.power,
            timestamp: x.timestamp,
            value: x.value,
          };
        });
        return mapToDto(oneMinData);
      case '5Minutes':
        const fiveMinData = await this.dataService.findDataRange5MinutePeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return mapToDto(fiveMinData);
      case '15Minutes':
        const fifteenMinData =
          await this.dataService.findDataRange15MinutePeriod({
            startDate,
            endDate,
            regionId,
            fuelId,
            powerId,
          });
        return mapToDto(fifteenMinData);
      case '1Hour':
        const oneHourData = await this.dataService.findDataRange1HourPeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return mapToDto(oneHourData);
      case '6Hours':
        const sixHourData = await this.dataService.findDataRange6HourPeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return mapToDto(sixHourData);
      case '1Day':
        const oneDayData = await this.dataService.findDataRange1DayPeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return mapToDto(oneDayData);
      default:
        throw new BadRequestException('Invalid period');
    }

    // TODO: re-aggregate the data for different periods

    // const dataDto: DataDto = data.reduce(
    //   (dto: DataDto, df: DataFact) => {
    //     // add meta data if it does not exist already
    //     if (!dto.metadata.fuels.includes(df.fuel)) {
    //       dto.metadata.fuels.push(df.fuel);
    //     }

    //     if (!dto.metadata.power.includes(df.power)) {
    //       dto.metadata.power.push(df.power);
    //     }

    //     if (!dto.metadata.regions.includes(df.region)) {
    //       dto.metadata.regions.push(df.region);
    //     }

    //     // add data point
    //     dto.data.push({
    //       fuelId: df.fuel.id,
    //       powerId: df.power.id,
    //       regionId: df.region.id,
    //       timestamp: df.timestamp,
    //       value: df.value,
    //     });

    //     return dto;
    //   },
    //   {
    //     metadata: {
    //       fuels: [],
    //       regions: [],
    //       power: [],
    //     },
    //     data: [],
    //   },
    // );

    // return dataDto;

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
