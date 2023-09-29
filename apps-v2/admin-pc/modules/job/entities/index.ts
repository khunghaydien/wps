import { combineReducers } from 'redux';

import assignmentList from './assignmentList';
import baseRecord from './baseRecord';
import historyRecords from './historyRecords';
import ids from './ids';
import jobTypeList from './jobTypeList';
import list from './list';
import totalCount from './totalCount';

const reducers = combineReducers({
  assignmentList,
  baseRecord,
  historyRecords,
  ids,
  jobTypeList,
  list,
  totalCount,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
