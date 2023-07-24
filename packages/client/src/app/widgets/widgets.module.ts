import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileWidgetComponent } from './user-profile-widget/user-profile-widget.component';
import { CreateThingWidgetComponent } from './create-thing-widget/create-thing-widget.component';
import { ComponentsModule } from '../components/components.module';
import { IonicModule } from '@ionic/angular';


const widgets = [
  UserProfileWidgetComponent,
  CreateThingWidgetComponent,
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
