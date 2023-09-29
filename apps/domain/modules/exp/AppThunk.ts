import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export type AppDispatch = ThunkDispatch<unknown, void, Action<string>>;
