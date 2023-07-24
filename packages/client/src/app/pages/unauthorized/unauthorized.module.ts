import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnauthorizedPageRoutingModule } from './unauthorized-routing.module';

import { UnauthorizedPage } from './unauthorized.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnauthorizedPageRoutingModule
  ],
  declarations: [UnauthorizedPage]
})
export class UnauthorizedPageModule {}
