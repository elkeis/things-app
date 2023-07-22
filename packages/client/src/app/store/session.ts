import { createReducer, on, createAction, props } from '@ngrx/store';

export const initialState: {
  name?: string,
  avatarUrl?: string,
} = {}

export const actions = {
  login: createAction('[Session] login', props<typeof initialState>())
}

export const counterReducer = createReducer(
  initialState,
  on(actions.login, (state, {type, ...props}) => ({...state, ...props})),
);

