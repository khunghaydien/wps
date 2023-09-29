import { combineReducers } from 'redux';

import entities from './entities';
import ui from './ui';

const reducers = {
  ui,
  entities,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
