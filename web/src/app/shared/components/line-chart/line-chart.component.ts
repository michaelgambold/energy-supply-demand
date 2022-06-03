import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input()
  series!: LineSeries[];

  @Input()
  data!: LineDataPoint[];

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    series: [],
    time: {
      useUTC: false,
    },
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
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['series']) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.series || !this.data) return;

    this.chartOptions.series = [];

    this.series.forEach((s) => {
      this.chartOptions.series?.push({
        type: 'line',
        name: s.name,
        data: this.data
          .filter((x) => x.seriesId === s.id)
          .map((x) => [x.unixTimestamp, x.value]),
      });
    });

    this.updateFlag = true;
  }
}

export interface LineSeries {
  id: string | number;
  name: string;
}

export interface LineDataPoint {
  unixTimestamp: number;
  value: number;
  seriesId: string | number;
}
