import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileWidgetComponent } from './user-profile-widget/user-profile-widget.component';
import { ComponentsModule } from '../components/components.module';


const widgets = [
  UserProfileWidgetComponent,
]

@NgModule({
  declarations: [...widgets],
  exports: [...widgets],
  imports: [
    ComponentsModule,
    CommonModule
  ]
})
export class WidgetsModule { }
