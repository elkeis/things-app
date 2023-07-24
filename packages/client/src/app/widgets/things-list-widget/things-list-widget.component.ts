import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, EventType, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { BaseThing, thingSchemaBase, thingSchema } from '@local/schemas/src';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription, catchError, exhaustMap, from, map, of, tap } from 'rxjs';
import { actions, initialState } from 'src/app/store/things';
import { TrpcService } from 'src/app/trpc.service';
import {z} from 'zod';

@Component({
  selector: 'app-things-list-widget',
  templateUrl: './things-list-widget.component.html',
  styleUrls: ['./things-list-widget.component.scss'],
})
export class ThingsListWidgetComponent  implements OnInit, OnDestroy {
  public thingsState$: Observable<typeof initialState>;
  public thingsList$: Observable<BaseThing[]>;

  @Input() isSubList = false;

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

  openThing$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.openThing),
        tap(() => this.store.dispatch(actions.setUpdating({updating: true}))),
        exhaustMap(({type, ...payload}) =>
          from(this.trpc.client.things.getItemById.query(payload.id)).pipe(
            map((thing) => actions.setOpenedThing({openedThing: (thingSchema.parse(thing) || undefined)}))
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
      if (state.things.openedThing) {
        return state.things.openedThing?.contents || [];
      } else {
        return state.things.list;
      }
    });
  }

  async ngOnInit() {
    this.subscriptions.push(
      this.updateThings$.subscribe(a => this.store.dispatch(a)),
      this.deleteThing$.subscribe(a => this.store.dispatch(a)),
      this.openThing$.subscribe(a => {
        this.store.dispatch(a)
        this.router.navigate([
          z.string().uuid()
            .transform(v => `open/${v}`)
            .catch('')
            .parse(a.openedThing?.id)
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
      this.updateList();
    }
  }

  ngOnDestroy(): void {
    return this.subscriptions.forEach(s => s.unsubscribe())
  }

  async updateList() {
    this.store.dispatch(actions.updateList());
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
    this.store.dispatch(actions.setOpenedThing({openedThing: undefined}));
  }

}
