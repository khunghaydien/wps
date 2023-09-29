import { combineReducers } from 'redux';

import ui from './ui';

const rootReducer = combineReducers({
  ui,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
