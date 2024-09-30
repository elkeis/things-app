import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from "../essentials/button/button.component";

@Component({
  selector: 'app-stale-tab-popup',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './stale-tab-popup.component.html',
  styleUrl: './stale-tab-popup.component.scss'
})
export class StaleTabPopupComponent {
  @Output('onSubmit') onSubmit = new EventEmitter<void>();

  processSubmit() {
    this.onSubmit.emit();
  }
}
