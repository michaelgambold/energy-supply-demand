import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css'],
})
export class StackedBarChartComponent implements OnInit, OnChanges {
  @Input()
  categories!: StackedBarCategory[];

  @Input()
  series!: StackedBarSeries[];

  @Input()
  data!: StackedBarDataPoint[];

  @Input()
  title!: string;

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },
    series: [],
    time: {
      useUTC: false,
    },
    xAxis: {
      categories: [],
    },
  }; // required
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  constructor() {}

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['title'] ||
      changes['data'] ||
      changes['series'] ||
      changes['categories']
    ) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.series || !this.data || !this.categories) return;

    this.chartOptions.title = {
      text: this.title,
    };

    this.chartOptions.xAxis = {
      categories: this.categories.map((x) => x.name),
    };

    this.chartOptions.series = this.series.map((s) => {
      const seriesDataPoints = this.data.filter((x) => x.seriesId === s.id);
      return {
        type: 'bar',
        name: s.name,
        data: this.categories.map((c) => {
          const dataPoint = seriesDataPoints.find((s) => s.categoryId === c.id);
          return dataPoint ? dataPoint.value : 0;
        }),
      };
    });

    this.updateFlag = true;
  }
}

export interface StackedBarCategory {
  id: string | number;
  name: string;
}

export interface StackedBarSeries {
  id: string | number;
  name: string;
}

export interface StackedBarDataPoint {
  value: number;
  seriesId: string | number;
  categoryId: string | number;
}
