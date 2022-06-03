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

@NgModule({
  declarations: [
    ToolbarComponent,
    LineChartComponent,
    FuelsToLineSeriesPipe,
    DataToLineDataPointsPipe,
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
  ],
})
export class SharedModule {}
