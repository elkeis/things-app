import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorizePageRoutingModule } from './authorize-routing.module';

import { AuthorizePage } from './authorize.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthorizePageRoutingModule
  ],
  declarations: [AuthorizePage]
})
export class AuthorizePageModule {}
