import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HighchartsChartModule } from 'highcharts-angular';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { FuelsToLineSeriesPipe } from './pipes/fuels-to-line-series.pipe';
import { DataToLineDataPointsPipe } from './pipes/data-to-line-data-points.pipe';

@NgModule({
  declarations: [
    NavbarComponent,
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
    MatIconModule,
  ],
  exports: [
    NavbarComponent,
    LineChartComponent,
    FuelsToLineSeriesPipe,
    DataToLineDataPointsPipe,
  ],
})
export class SharedModule {}
