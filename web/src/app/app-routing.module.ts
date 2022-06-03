import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricDataPageComponent } from './pages/historic-data-page/historic-data-page.component';
import { LiveDataPageComponent } from './pages/live-data-page/live-data-page.component';

const routes: Routes = [
  {
    path: '',
    component: LiveDataPageComponent,
  },
  {
    path: 'historic',
    component: HistoricDataPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
