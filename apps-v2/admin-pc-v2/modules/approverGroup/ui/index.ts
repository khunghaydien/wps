import { combineReducers } from 'redux';

import tab from './tab';

const reducers = combineReducers({
  tab,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
