import { combineReducers } from 'redux';

import entities from './entities';
import ui from './ui';

const rootReducer = {
  entities,
  ui,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
