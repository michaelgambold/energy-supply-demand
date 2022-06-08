import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Data } from '../../shared/models/data';
import { Fuel } from '../../shared/models/fuel';
import { Power } from '../../shared/models/power';
import { Region } from '../../shared/models/region';

import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-historic-data-page',
  templateUrl: './historic-data-page.component.html',
  styleUrls: ['./historic-data-page.component.css'],
})
export class HistoricDataPageComponent implements OnInit, OnChanges {
  data$!: Observable<Data>;
  demandPowerId = 0;
  generatePowerId = 0;
  selectedTimeRange = 'Last Hour';
  selectedPeriod = '1 Minute';

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

  fuels: Fuel[] = [];
  regions: Region[] = [];
  power: Power[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  refreshData() {
    console.log(`time range: ${this.selectedTimeRange}`);
    console.log(`period: ${this.selectedPeriod}`);

    this.data$ = this.dataService.getLatestData().pipe(
      tap((data) => {
        // save metadata from data response
        this.fuels = data.metadata.fuels;
        this.power = data.metadata.power;
        this.regions = data.metadata.regions;

        const generatePower = data.metadata.power.find(
          (x) => x.type === 'generation'
        );
        this.generatePowerId = generatePower ? generatePower.id : 0;

        const demandPower = data.metadata.power.find(
          (x) => x.type === 'demand'
        );
        this.demandPowerId = demandPower ? demandPower.id : 0;
      })
    );
  }
}
