import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { State } from '@resource/modules';

export type AppAction<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  void,
  Action<string>
>;

export type AppDispatch = ThunkDispatch<State, void, Action<string>>;
