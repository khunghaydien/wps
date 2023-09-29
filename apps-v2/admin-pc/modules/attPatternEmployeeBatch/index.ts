import { combineReducers } from 'redux';

import entites from './entities';
import ui from './ui';

const reducers = combineReducers({
  entites,
  ui,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
