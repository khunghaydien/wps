import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { State } from '../modules';

export type AppAction<ReturnType = unknown> = ThunkAction<
  ReturnType,
  State,
  void,
  Action<unknown>
>;

export type AppDispatch = ThunkDispatch<
  State,
  void,
  Action<unknown | AppAction>
>;
