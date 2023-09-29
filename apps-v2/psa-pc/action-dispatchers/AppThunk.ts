import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { State } from '@psa/modules';

export type AppAction<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  void,
  Action<string>
>;

export type AppDispatch = ThunkDispatch<unknown, void, Action<string>>;
