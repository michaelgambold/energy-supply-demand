import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { FuelsToLineSeriesPipe } from './pipes/fuels-to-line-series.pipe';
import { DataToLineDataPointsPipe } from './pipes/data-to-line-data-points.pipe';
import { FilterDataByFuelPipe } from './pipes/filter-data-by-fuel.pipe';
import { FilterDataByRegionPipe } from './pipes/filter-data-by-region.pipe';
import { FilterDataByPowerPipe } from './pipes/filter-data-by-power.pipe';

@NgModule({
  declarations: [
    ToolbarComponent,
    LineChartComponent,
    FuelsToLineSeriesPipe,
    DataToLineDataPointsPipe,
    FilterDataByFuelPipe,
    FilterDataByRegionPipe,
    FilterDataByPowerPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    HighchartsChartModule,
  ],
  exports: [
    ToolbarComponent,
    LineChartComponent,
    FuelsToLineSeriesPipe,
    DataToLineDataPointsPipe,
    FilterDataByFuelPipe,
    FilterDataByRegionPipe,
    FilterDataByPowerPipe,
  ],
})
export class SharedModule {}
