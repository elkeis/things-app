import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThingsPage } from './things.page';

const routes: Routes = [
  {
    path: '',
    component: ThingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThingsPageRoutingModule {}
