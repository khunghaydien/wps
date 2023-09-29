import { combineReducers } from 'redux';

import advSearch from './advSearch';

const reducers = {
  advSearch,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
