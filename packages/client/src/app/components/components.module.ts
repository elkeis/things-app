import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { IonicModule } from '@ionic/angular';
import { ThingFormComponent } from './thing-form/thing-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const components = [
  UserProfileComponent,
  ThingFormComponent,
]

@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    IonicModule
  ],
})
export class ComponentsModule { }
