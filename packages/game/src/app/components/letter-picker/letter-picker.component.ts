import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WheelComponent } from "./wheel/wheel.component";
import { FormsModule } from '@angular/forms';
import { VisualSupportComponent } from './visual-support/visual-support.component';

@Component({
  selector: 'app-letter-picker',
  standalone: true,
  imports: [WheelComponent, FormsModule, VisualSupportComponent],
  templateUrl: './letter-picker.component.html',
  styleUrl: './letter-picker.component.scss'
})
export class LetterPickerComponent {

  @Input('letters') letters: string[] = [];
  @Input('disabled') disabled: boolean = false;
  @Output('onGuess') onGuess = new EventEmitter<string>();
  @Output('onLetterSelect') onLetterSelect = new EventEmitter<string>();

  @ViewChild(VisualSupportComponent) visualSupport!: VisualSupportComponent;
  trackingElement = document.body;


  set lettersString(letters: string) {
    this.letters = letters.split('');
  }

  get lettersString() {
    return this.letters.join('');
  }

  processLetterSelect([element, rec, letters]: [HTMLDivElement, DOMRect, string[]]) {
    this.visualSupport.disconnectNodes();
    this.visualSupport.addNode(this.getCenter(rec), element);
    this.visualSupport.connectNodes();
    this.onLetterSelect.emit(letters.join(''));
  }

  processLetterDeselect([elements, recs, letters]: [HTMLDivElement[], DOMRect[], string[]]) {
    this.visualSupport.disconnectNodes();
    recs.forEach((rec, index) => {
      this.visualSupport.removeNode(this.getCenter(rec), elements[index]);
    })
    this.visualSupport.connectNodes();
    this.onLetterSelect.emit(letters.join(''))
  }

  processEndSelection([,, word]: [HTMLDivElement[],DOMRect[],string[]]) {
    this.onGuess.emit(word.join(''));
  }

  processMouseMove([x, y]: [number, number]) {
    this.visualSupport.registerMousemove(x, y);
  }

  private getCenter(rec: DOMRect): [number, number] {
    return [rec.x + Math.round(rec.width/2), rec.y + Math.round(rec.height/2)];
  }
}
