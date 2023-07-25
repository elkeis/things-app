import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseThing, Thing, thingSchema } from '@local/schemas/src';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, exhaustMap, from, map, tap } from 'rxjs';
import { TrpcService } from 'src/app/services/trpc.service';
import { actions, initialState } from 'src/app/store/things';

@Component({
  selector: 'app-pack-container-widget',
  templateUrl: './pack-container-widget.component.html',
  styleUrls: ['./pack-container-widget.component.scss'],
})
export class PackContainerWidgetComponent  implements OnInit, OnDestroy {

  showPackContainerForm$: Observable<boolean>;
  packableThings$: Observable<BaseThing[]>;
  container$: Observable<Thing | undefined>;
  packThings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.packThings),
        concatLatestFrom(action => this.store.select(state => state.things.openedThing?.id || '')),
        tap(() => this.store.dispatch(actions.setUpdating({updating: true}))),
        exhaustMap(([{type, ...payload}, containerId]) =>
          from(this.trpc.client.things.packContainer.query({
            containerId, things: payload.things.map(thing => thing.id || '')
          })).pipe(
            map((updatedContainer) => actions.setOpenedThing({openedThing: thingSchema.parse(updatedContainer)}))
          )
        ),
        tap(() => this.store.dispatch(actions.setUpdating({updating: false})))
      )
  );

  constructor(
    private store: Store<{things: typeof initialState}>,
    private trpc: TrpcService,
    private actions$: Actions,
  ) {
    this.showPackContainerForm$ = this.store.select(state => state.things.showPackContainerForm);
    this.packableThings$ = this.store.select(
      state => [
        ...state.things.list,
        ...(state.things.openedThing?.contents|| [])
      ]
    );
    this.container$ = this.store.select(state => state.things.openedThing);
  }

  private subscriptions : Subscription[] = []

  ngOnInit() {
    this.subscriptions.push(
      this.packThings$.subscribe(a => this.store.dispatch(a))
    )
    this.store.dispatch(actions.updateList());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  openPackContainerForm() {
    this.store.dispatch(actions.showPackContainerForm());
  }

  closePackContainerForm() {
    this.store.dispatch(actions.hidePackContainerForm());
  }

  handlePack(things: BaseThing[]) {
    this.closePackContainerForm();
    this.store.dispatch(actions.packThings({things}));
  }

}
