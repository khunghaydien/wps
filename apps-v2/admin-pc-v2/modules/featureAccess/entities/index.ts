import { combineReducers } from 'redux';

import list from './list';
import record from './record';

const reducers = combineReducers({
  list,
  record,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
