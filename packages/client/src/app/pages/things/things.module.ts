import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThingsPageRoutingModule } from './things-routing.module';

import { ThingsPage } from './things.page';

import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThingsPageRoutingModule,
    WidgetsModule
  ],
  declarations: [ThingsPage]
})
export class ThingsPageModule {}
