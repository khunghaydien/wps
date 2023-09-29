import { combineReducers } from 'redux';

import dialog from './dialog';
import operation from './operation';

const reducers = {
  dialog,
  operation,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
