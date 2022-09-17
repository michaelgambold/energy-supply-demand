import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricDataPageComponent } from './pages/historic-data-page/historic-data-page.component';
import { LiveDataPageComponent } from './pages/live-data-page/live-data-page.component';
import { StatsComponent } from './pages/stats/stats.component';

const routes: Routes = [
  {
    path: '',
    component: LiveDataPageComponent,
  },
  {
    path: 'historic',
    component: HistoricDataPageComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
