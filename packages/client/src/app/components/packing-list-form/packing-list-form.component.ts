import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { BaseThing } from '@local/schemas/src';
import {intersection} from 'lodash';

@Component({
  selector: 'app-packing-list-form',
  templateUrl: './packing-list-form.component.html',
  styleUrls: ['./packing-list-form.component.scss'],
})
export class PackingListFormComponent  implements OnInit, OnChanges {

  @Input() things?: BaseThing[] | null;
  @Input() autoSelect?: BaseThing[] | null;
  @Input() volume: number = 0;
  @Output() pack = new EventEmitter<BaseThing[]>();
  @Output() cancel = new EventEmitter<void>();

  public selected: BaseThing[] = [];

  constructor() {}

  select(thing: BaseThing) {
    if (
      !this.selected.includes(thing)
      && this.isFits(thing)
    ) {
      this.selected.push(thing);
    }
  }

  isFits(thing: BaseThing) {
    if (this.selected.includes(thing)) return true;
    return this.volume - this.calculateOccupiedVolume() >= thing.volume;
  }

  calculateOccupiedVolume() {
    return this.selected.map(thing => thing.volume).reduce((r,v) => r + v, 0);
  }

  calculatePreoccupied() {
    return this.autoSelect?.map(thing => thing.volume).reduce((r,v) => r + v, 0) || 0;
  }

  deselect(thing: BaseThing) {
    if(this.selected.includes(thing)) {
      this.selected = this.selected.filter(selected => selected.id !== thing.id);
    }
  }

  toggle(thing: BaseThing) {
    if (this.selected.includes(thing)) this.deselect(thing);
    else this.select(thing);
  }

  isSelected(thing: BaseThing) {
    return this.selected.includes(thing);
  }

  batchSelect(things: BaseThing[]) {
    intersection(things, this.things).forEach(thing => this.select(thing));
  }

  performCancel() {
    this.cancel.emit();
  }
  performPack() {
    this.pack.emit([...this.selected]);
  }

  ngOnChanges({autoSelect}: {autoSelect? : SimpleChange}): void {
    if (autoSelect) {
      this.batchSelect(autoSelect.currentValue as BaseThing[] || []);
    }
  }

  ngOnInit() {

  }
}
