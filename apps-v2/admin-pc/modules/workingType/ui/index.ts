import { combineReducers } from 'redux';

import detail from './detail';
import list from './list';
import paging from './paging';
import pattern from './pattern';
import searchCondition from './searchCondition';

const reducers = combineReducers({
  list,
  detail,
  searchCondition,
  pattern,
  paging,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
