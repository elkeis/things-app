import type { BaseThing, Thing } from '@local/schemas';
import { createReducer, on, createAction, props } from '@ngrx/store';
import * as _ from 'lodash';

export const initialState: {
  container?: Thing,
  showCreateThingForm: boolean,
  showPackContainerForm: boolean,
  updating: boolean,
} = {
  updating: false,
  showCreateThingForm: false,
  showPackContainerForm: false,
}

export const actions = {
  setContainer: createAction('[Things] set opened thing', props<{container?: Thing}>()),
  openThing: createAction(`[Things] open thing`, props<{id: string | undefined}>()),
  setUpdating: createAction(`[Things] set updating`, props<{updating: boolean}>()),
  deleteThing: createAction(`[Things] delete item`, props<{id: string}>()),
  updateRoot: createAction(`[Things] update list`),
  showCreateThingForm: createAction('[Things] show create thing form'),
  hideCreateThingForm: createAction('[Things] hide create thing form'),
  showPackContainerForm: createAction('[Things] show pack container form'),
  hidePackContainerForm: createAction('[Things] hide pack container form'),
  packThings: createAction('[Things] pack things', props<{things: BaseThing[]}>()),
}

export const thingsReducer = createReducer(
  initialState,
  on(actions.setContainer, (state, {type, ...props}) => ({...state, ...props})),
  on(actions.setUpdating, (state, {type, ...props}) => ({...state, ...props})),
  on(actions.packThings, state => state),
  on(actions.updateRoot, state => state),
  on(actions.showCreateThingForm, (state) => ({...state, showCreateThingForm: true})),
  on(actions.hideCreateThingForm, (state) => ({...state, showCreateThingForm: false})),
  on(actions.showPackContainerForm, (state) => ({...state, showPackContainerForm: true})),
  on(actions.hidePackContainerForm, (state) => ({...state, showPackContainerForm: false})),
);

