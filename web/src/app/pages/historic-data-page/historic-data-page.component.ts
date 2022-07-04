import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, shareReplay, Subscription } from 'rxjs';
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
  fuelTypeGenerationData$!: Observable<Data>;

  selectedRegion?: Region;

  timeRanges: { label: string; value: HistoricDataTimeRange }[] = [
    { label: 'Last Hour', value: '1Hour' },
    { label: 'Last 3 Hours', value: '3Hours' },
    { label: 'Last 6 Hours', value: '6Hours' },
    { label: 'Last 12 Hours', value: '12Hours' },
    { label: 'Last 24 Hours', value: '24Hours' },
    { label: 'Last 3 Days', value: '3Days' },
    { label: 'Last 1 Week', value: '1Week' },
    { label: 'Last 2 Weeks', value: '2Weeks' },
  ];

  periods: { label: string; value: HistoricDataPeriod }[] = [
    { label: '1 Minute', value: '1Minute' },
    { label: '5 Minutes', value: '5Minutes' },
    { label: '15 Minutes', value: '15Minutes' },
    { label: '1 Hour', value: '1Hour' },
    { label: '6 Hours', value: '6Hours' },
    { label: '1 Day', value: '1Day' },
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

  selectedTimeRange: HistoricDataTimeRange = '1Hour';
  selectedPeriod: HistoricDataPeriod = '1Minute';
  selectedRegionIndex = 0;

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

      // update selections from query params if we have them
      this.selectedRegionIndex = Number(paramMap.get('region') || 0);
      this.selectedPeriod = paramMap.has('period')
        ? (paramMap.get('period') as HistoricDataPeriod)
        : '1Minute';
      this.selectedTimeRange = paramMap.has('timerange')
        ? (paramMap.get('timerange') as HistoricDataTimeRange)
        : '1Hour';

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
    this.generationData$ = this.dataService
      .getHistoricData({
        period: this.selectedPeriod,
        timeRange: this.selectedTimeRange,
        regionId: this.regions[this.selectedRegionIndex].id,
        powerId: this.power.find((x) => x.type === 'generation')?.id,
      })
      .pipe(shareReplay()); // hack to stop multiple requests

    this.fuelTypeGenerationData$ = this.dataService
      .getFuelTypeHistoricData({
        period: this.selectedPeriod,
        timeRange: this.selectedTimeRange,
        regionId: this.regions[this.selectedRegionIndex].id,
        powerId: this.power.find((x) => x.type === 'generation')?.id,
      })
      .pipe(shareReplay()); // hack to stop multiple requests

    this.demandData$ = this.dataService
      .getHistoricData({
        period: this.selectedPeriod,
        timeRange: this.selectedTimeRange,
        regionId: this.regions[this.selectedRegionIndex].id,
        powerId: this.power.find((x) => x.type === 'demand')?.id,
      })
      .pipe(shareReplay()); // hack to stop multiple requests
  }
}
