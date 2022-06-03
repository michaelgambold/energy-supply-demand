import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Data, Fuel, Region } from '../../models/data';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input()
  data?: Data;

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    series: [],
    xAxis: {
      type: 'datetime',
    },
  }; // required
  // chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    console.log(this.data);
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.data) return;

    console.log('updating chart data');

    // break up data into series
    const tempMap: {
      fuel: Fuel;
      region: Region;
      series: Highcharts.SeriesLineOptions;
    }[] = [];

    // pivot data into chart format
    this.data.data.forEach((dataPoint) => {
      let mapObject = tempMap.find(
        (x) =>
          x.fuel.id === dataPoint.fuelId && x.region.id === dataPoint.regionId
      );

      // if we have not processed this already then create a new series
      if (!mapObject) {
        const fuel = this.data!.metadata.fuels.find(
          (x) => x.id === dataPoint.fuelId
        );
        const region = this.data!.metadata.regions.find(
          (x) => x.id === dataPoint.regionId
        );

        mapObject = {
          fuel: fuel!,
          region: region!,
          series: {
            type: 'line',
            name: fuel?.name,
            data: [],
          },
        };

        tempMap.push(mapObject);
      }

      mapObject.series.data?.push([
        dataPoint.timestamp.valueOf(),
        dataPoint.value,
      ]);
    });

    console.log(tempMap.map((x) => x.series));

    this.chartOptions.series = tempMap.map((x) => x.series);
    this.updateFlag = true;
  }

  ngAfterViewInit(): void {
    console.log(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartData();
    }
  }
}
