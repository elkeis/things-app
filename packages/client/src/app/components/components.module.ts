import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { IonicModule } from '@ionic/angular';


const components = [
  UserProfileComponent
]

@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [
    CommonModule,
    IonicModule
  ],
})
export class ComponentsModule { }
