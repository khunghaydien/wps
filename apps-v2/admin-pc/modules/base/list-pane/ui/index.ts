import { combineReducers } from 'redux';

import list from './list';
import paging from './paging';
import sortCondition from './sortCondition';

const reducers = combineReducers({
  paging,
  sortCondition,
  list,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
