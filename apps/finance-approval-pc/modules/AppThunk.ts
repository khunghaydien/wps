import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from './index';

export type AppDispatch = ThunkDispatch<State, void, Action<string>>;
