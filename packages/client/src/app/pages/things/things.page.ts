import { Component, OnInit } from '@angular/core';
import { Thing } from '@local/schemas/src';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { initialState } from 'src/app/store/things';

@Component({
  selector: 'app-things',
  templateUrl: './things.page.html',
  styleUrls: ['./things.page.scss'],
})
export class ThingsPage implements OnInit {
  isRoot$: Observable<boolean>;

  constructor(
    private store: Store<{things: typeof initialState}>
  ) {
    this.isRoot$ = this.store.select(state => state.things.container?.type === 'ROOT');
  }

  ngOnInit() {
  }

}
