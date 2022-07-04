import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { isAfter, isBefore, subDays, subHours, subWeeks } from 'date-fns';
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

  @Get('/groupby/fueltype/timerange/:timerange/period/:period')
  async findFuelTypesData(
    @Param('timerange') timeRange: TimeRange,
    @Param('period') period: Period,
    @Query('region') region: string,
    @Query('power') power: string,
  ) {
    if (!timeRange) throw new BadRequestException('Time range cannot be null');
    if (!period) throw new BadRequestException('Period cannot be null');

    const [regions, powers] = await Promise.all([
      this.regionService.findAll(),
      this.powerService.findAll(),
    ]);

    const regionId = region && parseInt(region);
    const powerId = power && parseInt(power);

    const endDate = new Date();
    const startDate = this.getStartDate(endDate, timeRange);

    switch (period) {
      case '1Minute':
        const oneMinData =
          await this.dataService.findFuelTypeGroupedDataRange1MinutePeriod({
            startDate,
            endDate,
            regionId,
            powerId,
          });
        return this.mapFuelTypeGroupSumToDto(powers, regions, oneMinData);
      case '5Minutes':
        const fiveMinData =
          await this.dataService.findFuelTypeGroupedDataRange5MinutePeriod({
            startDate,
            endDate,
            regionId,
            powerId,
          });
        return this.mapFuelTypeGroupSumToDto(powers, regions, fiveMinData);
      case '15Minutes':
        const fifteenMinData =
          await this.dataService.findFuelTypeGroupedDataRange15MinutePeriod({
            startDate,
            endDate,
            regionId,
            powerId,
          });
        return this.mapFuelTypeGroupSumToDto(powers, regions, fifteenMinData);
      case '1Hour':
        const oneHourData =
          await this.dataService.findFuelTypeGroupedDataRange1HourPeriod({
            startDate,
            endDate,
            regionId,
            powerId,
          });
        return this.mapFuelTypeGroupSumToDto(powers, regions, oneHourData);
      case '6Hours':
        const sixHourData =
          await this.dataService.findFuelTypeGroupedDataRange6HourPeriod({
            startDate,
            endDate,
            regionId,
            powerId,
          });
        return this.mapFuelTypeGroupSumToDto(powers, regions, sixHourData);
      case '1Day':
        const oneDayData =
          await this.dataService.findFuelTypeGroupedDataRange1DayPeriod({
            startDate,
            endDate,
            regionId,
            powerId,
          });
        return this.mapFuelTypeGroupSumToDto(powers, regions, oneDayData);
      default:
        throw new BadRequestException('Invalid period');
    }
  }

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
    const startDate = this.getStartDate(endDate, timeRange);

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
        return this.mapToDto(fuels, powers, regions, oneMinData);
      case '5Minutes':
        const fiveMinData = await this.dataService.findDataRange5MinutePeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return this.mapToDto(fuels, powers, regions, fiveMinData);
      case '15Minutes':
        const fifteenMinData =
          await this.dataService.findDataRange15MinutePeriod({
            startDate,
            endDate,
            regionId,
            fuelId,
            powerId,
          });
        return this.mapToDto(fuels, powers, regions, fifteenMinData);
      case '1Hour':
        const oneHourData = await this.dataService.findDataRange1HourPeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return this.mapToDto(fuels, powers, regions, oneHourData);
      case '6Hours':
        const sixHourData = await this.dataService.findDataRange6HourPeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return this.mapToDto(fuels, powers, regions, sixHourData);
      case '1Day':
        const oneDayData = await this.dataService.findDataRange1DayPeriod({
          startDate,
          endDate,
          regionId,
          fuelId,
          powerId,
        });
        return this.mapToDto(fuels, powers, regions, oneDayData);
      default:
        throw new BadRequestException('Invalid period');
    }
  }

  private mapFuelTypeGroupSumToDto(
    powers: PowerDimension[],
    regions: RegionDimension[],
    input: {
      regionId: number;
      powerId: number;
      timestamp: Date;
      greenSum: string | null;
      fossilSum: string | null;
      unknownSum: string | null;
      allSum: string; // cannot be null otherwise there would be no timestamp for this data point
    }[],
  ): DataDto {
    const greenFuel: Partial<FuelDimension> = {
      id: 1,
      name: 'Green',
      ref: 'green',
      type: 'green',
    };
    const fossilFuel: Partial<FuelDimension> = {
      id: 2,
      name: 'Fossil',
      ref: 'fossil',
      type: 'fossil',
    };
    const unknownFuel: Partial<FuelDimension> = {
      id: 3,
      name: 'Unknown',
      ref: 'unknown',
      type: 'unknown',
    };

    const fuels: FuelDimension[] = [
      greenFuel as FuelDimension,
      fossilFuel as FuelDimension,
      unknownFuel as FuelDimension,
    ];

    const dataDto: DataDto = input.reduce(
      (dto: DataDto, input) => {
        const r = regions.find((x) => x.id === input.regionId);
        const p = powers.find((x) => x.id === input.powerId);

        // add meta data if it does not exist already
        if (!dto.metadata.power.includes(p)) {
          dto.metadata.power.push(p);
        }

        if (!dto.metadata.regions.includes(r)) {
          dto.metadata.regions.push(r);
        }

        // update start/end/record count
        if (!dto.startTimestamp) {
          dto.startTimestamp = input.timestamp.toISOString();
        } else if (isBefore(input.timestamp, new Date(dto.startTimestamp))) {
          dto.startTimestamp = input.timestamp.toISOString();
        }

        if (!dto.endTimestamp) {
          dto.endTimestamp = input.timestamp.toISOString();
        } else if (isAfter(input.timestamp, new Date(dto.endTimestamp))) {
          dto.endTimestamp = input.timestamp.toISOString();
        }

        dto.recordCount = dto.recordCount + 3;

        // add 3 fuel data points
        dto.data = [
          ...dto.data,
          {
            fuelId: greenFuel.id,
            powerId: input.powerId,
            regionId: input.regionId,
            timestamp: input.timestamp,
            value:
              input.greenSum && input.allSum
                ? (parseInt(input.greenSum) / parseInt(input.allSum)) * 100
                : 0,
          },
          {
            fuelId: fossilFuel.id,
            powerId: input.powerId,
            regionId: input.regionId,
            timestamp: input.timestamp,
            value:
              input.fossilSum && input.allSum
                ? (parseInt(input.fossilSum) / parseInt(input.allSum)) * 100
                : 0,
          },
          {
            fuelId: unknownFuel.id,
            powerId: input.powerId,
            regionId: input.regionId,
            timestamp: input.timestamp,
            value:
              input.unknownSum && input.allSum
                ? (parseInt(input.unknownSum) / parseInt(input.allSum)) * 100
                : 0,
          },
        ];

        return dto;
      },
      {
        startTimestamp: '',
        endTimestamp: '',
        recordCount: 0,
        metadata: {
          fuels,
          regions: [],
          power: [],
        },
        data: [],
      },
    );

    return dataDto;
  }

  private mapToDto(
    fuels: FuelDimension[],
    powers: PowerDimension[],
    regions: RegionDimension[],
    input: {
      fuelId: number;
      regionId: number;
      powerId: number;
      timestamp: Date;
      value: number | string;
    }[],
  ): DataDto {
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

        // update start/end/record count
        if (!dto.startTimestamp) {
          dto.startTimestamp = input.timestamp.toISOString();
        } else if (isBefore(input.timestamp, new Date(dto.startTimestamp))) {
          dto.startTimestamp = input.timestamp.toISOString();
        }

        if (!dto.endTimestamp) {
          dto.endTimestamp = input.timestamp.toISOString();
        } else if (isAfter(input.timestamp, new Date(dto.endTimestamp))) {
          dto.endTimestamp = input.timestamp.toISOString();
        }

        dto.recordCount = dto.recordCount + 1;

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
        startTimestamp: '',
        endTimestamp: '',
        recordCount: 0,
        metadata: {
          fuels: [],
          regions: [],
          power: [],
        },
        data: [],
      },
    );

    return dataDto;
  }

  private getStartDate(endDate: Date, timeRange: TimeRange): Date {
    switch (timeRange) {
      case '1Hour':
        return subHours(endDate, 1);
      case '3Hours':
        return subHours(endDate, 3);
      case '6Hours':
        return subHours(endDate, 6);
      case '12Hours':
        return subHours(endDate, 12);
      case '24Hours':
        return subHours(endDate, 24);
      case '3Days':
        return subDays(endDate, 3);
      case '1Week':
        return subWeeks(endDate, 1);
      case '2Weeks':
        return subWeeks(endDate, 2);
      default:
        throw new BadRequestException('Invalid time range');
    }
  }
}
