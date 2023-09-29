import { combineReducers } from 'redux';

import histories from './histories';

const reducers = combineReducers({
  histories,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
