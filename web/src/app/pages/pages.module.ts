import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutModule } from '@angular/cdk/layout';
import { LiveDataPageComponent } from './live-data-page/live-data-page.component';
import { HistoricDataPageComponent } from './historic-data-page/historic-data-page.component';
import { SharedModule } from '../shared/shared.module';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [LiveDataPageComponent, HistoricDataPageComponent, StatsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    LayoutModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
  ],
  exports: [LiveDataPageComponent, HistoricDataPageComponent],
})
export class PagesModule {}
