import { Component, Input, OnInit } from '@angular/core';
import { BaseThing } from '@local/schemas/src';

@Component({
  selector: 'app-thing-card',
  templateUrl: './thing-card.component.html',
  styleUrls: ['./thing-card.component.scss'],
})
export class ThingCardComponent {
  @Input() thing?: BaseThing;

  constructor() { }

  ngOnInit() {}

}
