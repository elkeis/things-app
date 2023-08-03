import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseThing, thingSchema } from '@local/schemas/src';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, exhaustMap, from, map, tap } from 'rxjs';
import { actions, initialState } from 'src/app/store/things';
import { TrpcService } from 'src/app/services/trpc.service';
import {z} from 'zod';

@Component({
  selector: 'app-things-list-widget',
  templateUrl: './things-list-widget.component.html',
  styleUrls: ['./things-list-widget.component.scss'],
})
export class ThingsListWidgetComponent  implements OnInit, OnDestroy {
  public thingsState$: Observable<typeof initialState>;
  public isRoot$: Observable<boolean>;
  public thingsList$: Observable<BaseThing[]>;

  @Input() isSubList = false;

  updateRoot$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.updateRoot),
        tap(() => this.store.dispatch(actions.setUpdating({updating: true}))),
        exhaustMap(action =>
          from(this.trpc.client.things.getItemById.query(undefined)).pipe(
            map(root => actions.setContainer({container: thingSchema.parse(root) || undefined}))
          )
        ),
        tap(() => this.store.dispatch(actions.setUpdating({updating: false}))),
      )
  );

  deleteThing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.deleteThing),
        concatLatestFrom(action => this.store.select(state => state.things.container)),
        tap(() => this.store.dispatch(actions.setUpdating({updating: true}))),
        exhaustMap(([{type, ...payload}, container]) =>
          from(this.trpc.client.things.deleteItem.query(payload)).pipe(
            map(() => container ? actions.openThing({id: container.id || ''}) : actions.updateRoot(/* this is probably unreachable */))
          )
        ),
        tap(() => this.store.dispatch(actions.setUpdating({updating: false})))
      )
  )

  openThing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.openThing),
        tap(() => this.store.dispatch(actions.setUpdating({updating: true}))),
        exhaustMap(({type, ...payload}) =>
          from(this.trpc.client.things.getItemById.query(payload.id)).pipe(
            map((thing) => actions.setContainer({container: (thingSchema.parse(thing) || undefined)}))
          )
        ),
        tap(() => this.store.dispatch(actions.setUpdating({updating: false})))
      )
  );

  public subscriptions: Subscription[] = [];

  constructor(
    private store: Store<{things: typeof initialState}>,
    private trpc: TrpcService,
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.thingsState$ = this.store.select(state => state.things);
    this.thingsList$ = this.store.select(state => {
      return state.things.container?.contents || [];
    });
    this.isRoot$ = this.store.select(state => {
      return state.things.container?.type === 'ROOT';
    });
  }

  async ngOnInit() {
    this.subscriptions.push(
      this.updateRoot$.subscribe(a => this.store.dispatch(a)),
      this.deleteThing$.subscribe(a => this.store.dispatch(a)),
      this.openThing$.subscribe(a => {
        this.store.dispatch(a)
        this.router.navigate([
          z.string().uuid()
            .transform(v => `open/${v}`)
            .catch('')
            .parse(a.container?.id)
        ])
      }),
      this.route.paramMap.subscribe((params) => {
        const thingId = z.string().uuid().catch('').parse(params.get('thingId'));
        if (thingId) {
          this.openThing(thingId);
        } else {
          this.closeThing();
        }
      }),
    );

    if (!this.loadFromRoute()) {
      this.store.dispatch(actions.openThing({id: undefined}));
    }
  }

  ngOnDestroy(): void {
    return this.subscriptions.forEach(s => s.unsubscribe())
  }

  loadFromRoute() {
    const thingId = this.route.snapshot.paramMap.get('thingId');
    if (thingId && z.string().uuid().catch('').parse(thingId)) {
      this.store.dispatch(actions.openThing({id: thingId}));
      return true;
    } else {
      return false;
    }
  }

  async deleteThing(id?: string) {
    if (id) {
      this.store.dispatch(actions.deleteThing({id}))
    }
  }

  async openThing(id?: string) {
    if (id) {
      this.store.dispatch(actions.openThing({id}));
    }
  }

  async closeThing() {
    this.store.dispatch(actions.openThing({id: undefined}));
  }
}
