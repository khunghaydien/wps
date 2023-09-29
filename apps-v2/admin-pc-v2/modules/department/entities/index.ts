import { combineReducers } from 'redux';

import baseRecord from './baseRecord';
import historyRecordList from './historyRecordList';
import ids from './ids';
import list from './list';

const reducers = combineReducers({
  list,
  ids,
  baseRecord,
  historyRecordList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
