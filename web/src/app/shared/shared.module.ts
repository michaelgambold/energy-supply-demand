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
import { StackedBarChartComponent } from './components/stacked-bar-chart/stacked-bar-chart.component';
import { RegionsToStackedBarCategoriesPipe } from './pipes/regions-to-stacked-bar-categories';
import { FuelsToStackedBarSeriesPipe } from './pipes/fuels-to-stacked-bar-series.pipe';
import { DataToStackedBarDataPointsPipe } from './pipes/data-to-stacked-bar-data-points.pipe';
import { CombineRegionsPipe } from './pipes/combine-regions.pipe';
import { CombineRegionsGreenFossilPipe } from './pipes/combine-regions-green-fossil.pipe';

@NgModule({
  declarations: [
    NavbarComponent,
    LineChartComponent,
    FuelsToLineSeriesPipe,
    DataToLineDataPointsPipe,
    StackedBarChartComponent,
    RegionsToStackedBarCategoriesPipe,
    FuelsToStackedBarSeriesPipe,
    DataToStackedBarDataPointsPipe,
    CombineRegionsPipe,
    CombineRegionsGreenFossilPipe,
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
    StackedBarChartComponent,
    RegionsToStackedBarCategoriesPipe,
    DataToStackedBarDataPointsPipe,
    FuelsToStackedBarSeriesPipe,
    CombineRegionsPipe,
    CombineRegionsGreenFossilPipe,
  ],
})
export class SharedModule {}
