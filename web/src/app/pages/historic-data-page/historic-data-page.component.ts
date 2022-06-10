import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, shareReplay, tap, zip } from 'rxjs';
import { Data } from '../../shared/models/data';
import { Fuel } from '../../shared/models/fuel';
import { Power } from '../../shared/models/power';
import { Region } from '../../shared/models/region';

import { DataService } from '../../shared/services/data.service';
import { PowerService } from '../../shared/services/power.service';
import { RegionService } from '../../shared/services/region.service';

@Component({
  selector: 'app-historic-data-page',
  templateUrl: './historic-data-page.component.html',
  styleUrls: ['./historic-data-page.component.css'],
})
export class HistoricDataPageComponent implements OnInit {
  demandData$!: Observable<Data>;
  generationData$!: Observable<Data>;

  selectedTimeRange = 'Last Hour';
  selectedPeriod = '1 Minute';
  selectedRegion!: Region;

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

  constructor(
    private readonly dataService: DataService,
    private readonly regionService: RegionService,
    private readonly powerService: PowerService
  ) {}

  ngOnInit(): void {
    zip([this.powerService.getAll(), this.regionService.getAll()]).subscribe(
      (res) => {
        this.power = res[0];
        this.regions = res[1];
      }
    );
  }

  onRegionTabChange(index: number): void {
    console.log('region tab changed');
    this.selectedRegion = this.regions[index];
    this.refreshData();
  }

  refreshData() {
    console.log('refreshing data');
    // console.log(`time range: ${this.selectedTimeRange}`);
    // console.log(`period: ${this.selectedPeriod}`);
    // console.log(`region: ${this.selectedRegion}`);

    this.generationData$ = this.dataService
      .getHistoricData({
        period: '1Minute',
        timeRange: '1Hour',
        regionId: this.selectedRegion.id,
        powerId: this.power.find((x) => x.type === 'generation')?.id,
      })
      .pipe(shareReplay()); // hack to stop multiple requests

    this.demandData$ = this.dataService
      .getHistoricData({
        period: '1Minute',
        timeRange: '1Hour',
        regionId: this.selectedRegion.id,
        powerId: this.power.find((x) => x.type === 'demand')?.id,
      })
      .pipe(shareReplay()); // hack to stop multiple requests
  }
}
