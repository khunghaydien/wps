import { combineReducers } from 'redux';

import list from './list';

const reducers = combineReducers({
  list,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
