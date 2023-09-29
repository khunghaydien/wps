import { Action, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

// import { State } from '../modules';

export type AppAction<ReturnType = void> = ThunkAction<
  ReturnType,
  any,
  void,
  Action<string>
>;

export type AppDispatch = ThunkDispatch<unknown, void, AnyAction>;
