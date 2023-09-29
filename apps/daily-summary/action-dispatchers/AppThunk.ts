import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '../modules';

export type AppDispatch = ThunkDispatch<State, void, AnyAction>;
