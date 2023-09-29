import { combineReducers } from 'redux';

import assignment from './assignment';
import list from './list';

const reducers = {
  assignment,
  list,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
