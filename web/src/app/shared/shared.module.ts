import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [ToolbarComponent, LineChartComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    HighchartsChartModule,
  ],
  exports: [ToolbarComponent, LineChartComponent],
})
export class SharedModule {}
