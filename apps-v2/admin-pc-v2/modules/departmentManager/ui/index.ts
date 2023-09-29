import { combineReducers } from 'redux';

import dialog from './dialog';

const reducers = combineReducers({
  dialog,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
