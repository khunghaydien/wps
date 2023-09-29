import { combineReducers } from 'redux';

import detail from './detail';
import searchCondition from './searchCondition';
import searchQuery from './searchQuery';

const reducers = combineReducers({
  searchCondition,
  searchQuery,
  detail,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
