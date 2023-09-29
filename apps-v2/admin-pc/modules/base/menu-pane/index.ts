import { combineReducers } from 'redux';

import ui from './ui';

const reducers = combineReducers({
  ui,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
