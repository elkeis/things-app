import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseThing } from '@local/schemas/src';

@Component({
  selector: 'app-thing-card',
  templateUrl: './thing-card.component.html',
  styleUrls: ['./thing-card.component.scss'],
})
export class ThingCardComponent {
  @Input() thing?: BaseThing;
  @Output() open = new EventEmitter<string>()
  constructor() { }

  ngOnInit() {}

  openThing() {
    if (this.thing?.id && this.thing.type === 'CONTAINER') {
      this.open.emit(this.thing?.id)
    }
  }

}
