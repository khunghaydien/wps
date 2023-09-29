import { combineReducers } from 'redux';

import entities from './entities';

const reducers = combineReducers({
  entities,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
