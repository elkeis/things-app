import { Component, SimpleChanges } from '@angular/core';
import { BaseThing } from '@local/schemas/src';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { actions, initialState } from 'src/app/store/things';
import { TrpcService } from 'src/app/services/trpc.service';

@Component({
  selector: 'app-create-thing-widget',
  templateUrl: './create-thing-widget.component.html',
  styleUrls: ['./create-thing-widget.component.scss'],
})
export class CreateThingWidgetComponent {

  public showCreateForm$: Observable<boolean>;

  constructor(
    private store: Store<{things: typeof initialState}>,
    private trpc: TrpcService,
  ) {
    this.showCreateForm$ = this.store.select(state => {
      return state.things.showCreateThingForm
    });
  }

  openCreateForm() {
    this.store.dispatch(actions.showCreateThingForm());
  }

  dismissCreateForm() {
    this.store.dispatch(actions.hideCreateThingForm());
  }

  async createThing(thing: BaseThing) {
    const newThing = await this.trpc.client.things.createItem.query(thing);
    console.log(`new thing created: ${JSON.stringify(newThing, null, '\t')}`);
    this.store.dispatch(actions.updateRoot());
    this.dismissCreateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
