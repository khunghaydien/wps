import { combineReducers } from 'redux';

import detail from './detail';
import list from './list';
import searchCondition from './searchCondition';

const reducers = combineReducers({
  list,
  detail,
  searchCondition,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
