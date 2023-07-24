import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnauthorizedPage } from './unauthorized.page';

const routes: Routes = [
  {
    path: 'unauthorized',
    component: UnauthorizedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnauthorizedPageRoutingModule {}
