import { SafeUrl } from '@angular/platform-browser';
import { createReducer, on, createAction, props } from '@ngrx/store';

export const initialState: {
  user?: {
    name: string,
    avatar_url: string,
  }
} = {}

export const actions = {
  login: createAction('[Session] login', props<typeof initialState>())
}

export const sessionReducer = createReducer(
  initialState,
  on(actions.login, (state, {type, ...props}) => ({...state, ...props})),
);

