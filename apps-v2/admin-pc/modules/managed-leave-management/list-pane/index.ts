import { combineReducers } from 'redux';

import entities from './entities';
import ui from './ui';

const reducers = combineReducers({
  entities,
  ui,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
