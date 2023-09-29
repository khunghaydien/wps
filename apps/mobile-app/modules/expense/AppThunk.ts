import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from './index';

export type AppDispatch = ThunkDispatch<
  { expense: State },
  void,
  Action<string>
>;
