import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseThing, thingSchemaBase } from '@local/schemas/src';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, catchError, exhaustMap, from, map, of, tap } from 'rxjs';
import { actions, initialState } from 'src/app/store/things';
import { TrpcService } from 'src/app/trpc.service';

@Component({
  selector: 'app-things-list-widget',
  templateUrl: './things-list-widget.component.html',
  styleUrls: ['./things-list-widget.component.scss'],
})
export class ThingsListWidgetComponent  implements OnInit, OnDestroy {
  public thingsState$: Observable<typeof initialState>;
  updateThings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.updateList),
        tap(() => this.store.dispatch(actions.setUpdating({updating: true}))),
        exhaustMap(action =>
          from(this.trpc.client.things.getAllRoots.query()).pipe(
            map(list => actions.fetchRootThings({
              list: list.map(item => thingSchemaBase.parse(item))
            }))
          )
        ),
        tap(() => this.store.dispatch(actions.setUpdating({updating: false}))),
      )
  );

  deleteThing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.deleteThing),
        tap(() => this.store.dispatch(actions.setUpdating({updating: true}))),
        exhaustMap(({type, ...payload}) =>
          from(this.trpc.client.things.deleteItem.query(payload)).pipe(
            map(() => actions.updateList())
          )
        ),
        tap(() => this.store.dispatch(actions.setUpdating({updating: false})))
      )
  )

  public subscriptions: Subscription[] = [];

  constructor(
    private store: Store<{things: typeof initialState}>,
    private trpc: TrpcService,
    private actions$: Actions,
  ) {
    this.thingsState$ = this.store.select(state => state.things);
  }

  async ngOnInit() {
    this.subscriptions.push(
      this.updateThings$.subscribe(a => this.store.dispatch(a)),
      this.deleteThing$.subscribe(a => this.store.dispatch(a)),
    );
    this.updateList();
  }

  ngOnDestroy(): void {
    return this.subscriptions.forEach(s => s.unsubscribe())
  }

  async updateList() {
    this.store.dispatch(actions.updateList());
  }

  async deleteThing(id?: string) {
    if (id) {
      this.store.dispatch(actions.deleteThing({id}))
    }
  }

}
