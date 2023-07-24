import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseThing, thingSchemaBase } from '@local/schemas/src';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, catchError, exhaustMap, from, map, of } from 'rxjs';
import { actions, initialState } from 'src/app/store/things';
import { TrpcService } from 'src/app/trpc.service';

@Component({
  selector: 'app-things-list-widget',
  templateUrl: './things-list-widget.component.html',
  styleUrls: ['./things-list-widget.component.scss'],
})
export class ThingsListWidgetComponent  implements OnInit, OnDestroy {
  public things$: Observable<BaseThing[]>;
  updateThings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.updateList),
        exhaustMap(action =>
          from(this.trpc.client.things.getAllRoots.query()).pipe(
            map(list => actions.fetchRootThings({
              list: list.map(item => thingSchemaBase.parse(item))
            }))
          )
        )
      )
  );

  public subscriptions: Subscription[] = [];

  constructor(
    private store: Store<{things: typeof initialState}>,
    private trpc: TrpcService,
    private actions$: Actions,
  ) {
    this.things$ = this.store.select(state => state.things.list);
  }

  async ngOnInit() {
    this.subscriptions.push(
      this.updateThings$.subscribe(a => this.store.dispatch(a))
    );
    this.updateList();
  }

  ngOnDestroy(): void {
    return this.subscriptions.forEach(s => s.unsubscribe())
  }

  async updateList() {
    this.store.dispatch((actions.updateList()));
  }

}
