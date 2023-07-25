import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { IonicModule } from '@ionic/angular';
import { ThingFormComponent } from './thing-form/thing-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThingCardComponent } from './thing-card/thing-card.component';
import { PackingListFormComponent } from './packing-list-form/packing-list-form.component';


const components = [
  UserProfileComponent,
  ThingFormComponent,
  ThingCardComponent,
  PackingListFormComponent,
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
