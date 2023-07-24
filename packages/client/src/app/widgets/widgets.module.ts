import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileWidgetComponent } from './user-profile-widget/user-profile-widget.component';
import { CreateThingWidgetComponent } from './create-thing-widget/create-thing-widget.component';
import { ComponentsModule } from '../components/components.module';
import { IonicModule } from '@ionic/angular';
import { ThingsListWidgetComponent } from './things-list-widget/things-list-widget.component';


const widgets = [
  UserProfileWidgetComponent,
  CreateThingWidgetComponent,
  ThingsListWidgetComponent,
]

@NgModule({
  declarations: [...widgets],
  exports: [...widgets],
  imports: [
    ComponentsModule,
    CommonModule,
    IonicModule,
  ]
})
export class WidgetsModule { }
