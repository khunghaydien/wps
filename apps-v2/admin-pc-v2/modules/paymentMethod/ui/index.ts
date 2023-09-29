import { combineReducers } from 'redux';

import dualList from './dualList';

const reducers = combineReducers({
  dualList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
