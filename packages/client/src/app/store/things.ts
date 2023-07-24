import type { BaseThing } from '@local/schemas';
import { createReducer, on, createAction, props } from '@ngrx/store';
import * as _ from 'lodash';

export const initialState: {
  showCreateThingForm: boolean
  list: BaseThing[]
} = {
  list: [],
  showCreateThingForm: false,
}

export const actions = {
  updateList: createAction(`[Things] update list`),
  fetchRootThings: createAction('[Things] fetch all root', props<{list: typeof initialState['list']}>()),
  showCreateThingForm: createAction('[Things] show create thing form'),
  hideCreateThingForm: createAction('[Things] hide create thing form'),
}

export const thingsReducer = createReducer(
  initialState,
  on(actions.updateList, state => state),
  on(actions.fetchRootThings, (state, {type, ...props}) => {
    const old = state.list.map(item => item.id);
    const fresh = props.list.map(item => item.id);
    const untouched = _.intersection(old, fresh);
    const addition = _.difference(fresh, old);
    const items = state.list.filter(
      item => untouched.includes(item.id)
    ).concat(
      props.list.filter(item => addition.includes(item.id))
    );

    return {
      ...state,
      list: items,
    };
  }),
  on(actions.showCreateThingForm, (state) => ({...state, showCreateThingForm: true})),
  on(actions.hideCreateThingForm, (state) => ({...state, showCreateThingForm: false})),
);

