import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThingsPage } from './things.page';
import { AuthenticatedGuard } from 'src/app/guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: ThingsPage,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'open/:thingId',
    component: ThingsPage,
    canActivate: [AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThingsPageRoutingModule {}
