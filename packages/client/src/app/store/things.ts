import type { Thing } from '@local/schemas';
import { createReducer, on, createAction, props } from '@ngrx/store';

export const initialState: {
  showCreateThingForm: boolean
  list: Thing[]
} = {
  list: [],
  showCreateThingForm: false,
}

export const actions = {
  fetchRootThings: createAction('[Things] fetch all root', props<{list: typeof initialState['list']}>()),
  showCreateThingForm: createAction('[Things] show create thing form'),
  hideCreateThingForm: createAction('[Things] hide create thing form'),
}

export const thingsReducer = createReducer(
  initialState,
  on(actions.fetchRootThings, (state, {type, ...props}) => ({...state, ...props})),
  on(actions.showCreateThingForm, (state) => ({...state, showCreateThingForm: true})),
  on(actions.hideCreateThingForm, (state) => ({...state, showCreateThingForm: false})),
);

