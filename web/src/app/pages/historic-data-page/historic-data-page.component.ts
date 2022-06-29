import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  combineLatest,
  Observable,
  shareReplay,
  Subscription,
  zip,
} from 'rxjs';
import { LineSeries } from '../../shared/components/line-chart/line-chart.component';
import { Data } from '../../shared/models/data';
import { Power } from '../../shared/models/power';
import { Region } from '../../shared/models/region';

import {
  DataService,
  HistoricDataPeriod,
  HistoricDataTimeRange,
} from '../../shared/services/data.service';
import { PowerService } from '../../shared/services/power.service';
import { RegionService } from '../../shared/services/region.service';

@Component({
  selector: 'app-historic-data-page',
  templateUrl: './historic-data-page.component.html',
  styleUrls: ['./historic-data-page.component.css'],
})
export class HistoricDataPageComponent implements OnInit, OnDestroy {
  demandData$!: Observable<Data>;
  generationData$!: Observable<Data>;

  selectedRegion?: Region;

  timeRanges = [
    'Last Hour',
    'Last 3 Hours',
    'Last 6 Hours',
    'Last 12 Hours',
    'Last 24 Hours',
    'Last 3 Days',
    'Last 1 Week',
    'Last 2 Weeks',
  ];
  periods = [
    '1 Minute',
    '5 Minutes',
    '15 Minutes',
    '1 Hour',
    '6 Hours',
    '1 Day',
  ];

  power: Power[] = [];
  regions: Region[] = [];

  greenFossilLineSeries: LineSeries[] = [
    {
      id: 'green',
      name: 'Green',
    },
    {
      id: 'fossil',
      name: 'Fossil',
    },
    {
      id: 'unknown',
      name: 'Unknown',
    },
  ];

  selectedTimeRange = '';
  selectedPeriod = '';

  private selectedRegionIndex = 0;
  private sub!: Subscription;

  constructor(
    private readonly dataService: DataService,
    private readonly regionService: RegionService,
    private readonly powerService: PowerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.powerService.getAll(),
      this.regionService.getAll(),
      this.route.queryParamMap,
    ]).subscribe(([power, regions, paramMap]) => {
      this.power = power;
      this.regions = regions;

      this.selectedRegionIndex = Number(paramMap.get('region') || 0);
      this.selectedPeriod = paramMap.get('period') || '1 Minute';
      this.selectedTimeRange = paramMap.get('timerange') || 'Last Hour';

      console.log('selectedRegion: ' + this.selectedRegionIndex);
      console.log('selectedPeriod: ' + this.selectedPeriod);
      console.log('selectedTimeRange: ' + this.selectedTimeRange);

      this.selectedRegion = this.regions[this.selectedRegionIndex];

      this.refreshData();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onRegionTabChange(index: number): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        region: index,
        period: this.selectedPeriod,
        timerange: this.selectedTimeRange,
      },
    });
  }

  onTimeRangeChange(value: string): void {
    console.log(value);
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        region: this.selectedRegionIndex,
        period: this.selectedPeriod,
        timerange: value,
      },
    });
  }

  onPeriodChange(value: string): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        region: this.selectedRegionIndex,
        period: value,
        timerange: this.selectedTimeRange,
      },
    });
  }

  private refreshData() {
    let period: HistoricDataPeriod;
    let timeRange: HistoricDataTimeRange;

    switch (this.selectedTimeRange) {
      case 'Last 3 Hours':
        timeRange = '3Hours';
        break;
      case 'Last 6 Hours':
        timeRange = '6Hours';
        break;
      case 'Last 12 Hours':
        timeRange = '12Hours';
        break;
      case 'Last 24 Hours':
        timeRange = '24Hours';
        break;
      case 'Last 3 Days':
        timeRange = '3Days';
        break;
      case 'Last 1 Week':
        timeRange = '1Week';
        break;
      case 'Last 2 Weeks':
        timeRange = '2Weeks';
        break;
      default:
        timeRange = '1Hour';
        break;
    }

    switch (this.selectedPeriod) {
      case '5 Minutes':
        period = '5Minutes';
        break;
      case '15 Minutes':
        period = '15Minutes';
        break;
      case '1 Hour':
        period = '1Hour';
        break;
      case '6 Hours':
        period = '6Hours';
        break;
      case '1 Day':
        period = '1Day';
        break;
      default:
        period = '1Minute';
        break;
    }

    console.log('api: ' + period);

    this.generationData$ = this.dataService
      .getHistoricData({
        period,
        timeRange,
        regionId: this.regions[this.selectedRegionIndex].id,
        powerId: this.power.find((x) => x.type === 'generation')?.id,
      })
      .pipe(shareReplay()); // hack to stop multiple requests

    this.demandData$ = this.dataService
      .getHistoricData({
        period,
        timeRange,
        regionId: this.regions[this.selectedRegionIndex].id,
        powerId: this.power.find((x) => x.type === 'demand')?.id,
      })
      .pipe(shareReplay()); // hack to stop multiple requests
  }
}
