import type { BaseThing, Thing } from '@local/schemas';
import { createReducer, on, createAction, props } from '@ngrx/store';
import * as _ from 'lodash';

export const initialState: {
  openedThing?: Thing,
  showCreateThingForm: boolean,
  updating: boolean,
  list: BaseThing[]
} = {
  updating: false,
  list: [],
  showCreateThingForm: false,
}

export const actions = {
  setOpenedThing: createAction('[Things] set opened thing', props<{openedThing?: Thing}>()),
  openThing: createAction(`[Things] open thing`, props<{id: string}>()),
  setUpdating: createAction(`[Things] set updating`, props<{updating: boolean}>()),
  deleteThing: createAction(`[Things] delete item`, props<{id: string}>()),
  updateList: createAction(`[Things] update list`),
  fetchRootThings: createAction('[Things] fetch all root', props<{list: typeof initialState['list']}>()),
  showCreateThingForm: createAction('[Things] show create thing form'),
  hideCreateThingForm: createAction('[Things] hide create thing form'),
}

export const thingsReducer = createReducer(
  initialState,
  on(actions.setOpenedThing, (state, {type, ...props}) => ({...state, ...props})),
  on(actions.setUpdating, (state, {type, ...props}) => ({...state, ...props})),
  on(actions.updateList, state => state),
  on(actions.fetchRootThings, (state, {type, ...props}) => {
    const old = state.list.map(item => item.id);
    const fresh = props.list.map(item => item.id);
    const untouched = _.intersection(old, fresh);
    const additional = _.difference(fresh, old);
    const items = state.list.filter(
      item => untouched.includes(item.id)
    ).concat(
      props.list.filter(item => additional.includes(item.id))
    );

    return {
      ...state,
      list: items,
    };
  }),
  on(actions.showCreateThingForm, (state) => ({...state, showCreateThingForm: true})),
  on(actions.hideCreateThingForm, (state) => ({...state, showCreateThingForm: false})),
);

