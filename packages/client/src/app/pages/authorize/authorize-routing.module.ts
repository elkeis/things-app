import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizePage } from './authorize.page';

const routes: Routes = [
  {
    path: 'authorize',
    component: AuthorizePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizePageRoutingModule {}
