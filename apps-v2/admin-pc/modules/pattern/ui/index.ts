import { combineReducers } from 'redux';

import list from './list';
import paging from './paging';
import searchCondition from './searchCondition';

const reducers = combineReducers({
  list,
  searchCondition,
  paging,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
