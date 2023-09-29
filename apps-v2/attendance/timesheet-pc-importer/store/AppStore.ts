import { Action, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '@attendance/timesheet-pc-importer/modules';

export type AppState = State;
export type AppStore = Store<State>;
export type AppDispatch = ThunkDispatch<unknown, void, Action<string>>;
