import { combineReducers } from 'redux';

import permission from './permission';

const reducers = {
  permission,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
