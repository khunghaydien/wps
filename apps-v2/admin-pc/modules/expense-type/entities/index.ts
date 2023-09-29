import { combineReducers } from 'redux';

import baseRecord from './baseRecord';
import ids from './ids';
import list from './list';
import totalCount from './totalCount';

const reducers = combineReducers({
  baseRecord,
  ids,
  list,
  totalCount,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
