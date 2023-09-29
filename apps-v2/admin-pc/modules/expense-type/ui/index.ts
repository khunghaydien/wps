import { combineReducers } from 'redux';

import detail from './detail';
import searchCondition from './searchCondition';
import searchQuery from './searchQuery';

const reducers = combineReducers({
  detail,
  searchCondition,
  searchQuery,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
