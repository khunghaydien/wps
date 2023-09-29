import { combineReducers } from 'redux';

import events from './events';
import jobs from './jobs';
import user from './user';
import workCategories from './workCategories';

const rootReducer = {
  events,
  jobs,
  user,
  workCategories,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
