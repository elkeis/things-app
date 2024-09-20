import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterPickerComponent } from './letter-picker/letter-picker.component';
import { WheelComponent } from './letter-picker/wheel/wheel.component';
import {FormsModule} from '@angular/forms';
import { WordsGameViewComponent } from './words-game-view/words-game-view.component';


@NgModule({
  imports: [
    CommonModule,
    LetterPickerComponent,
    FormsModule,
    WordsGameViewComponent,
  ],
  exports: [LetterPickerComponent, WordsGameViewComponent]
})
export class ComponentsModule { }
