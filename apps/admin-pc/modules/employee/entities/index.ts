import { combineReducers } from 'redux';

import baseRecord from './baseRecord';
import historyRecordList from './historyRecordList';
import ids from './ids';
import list from './list';
import userList from './userList';

const reducers = combineReducers({
  list,
  ids,
  baseRecord,
  historyRecordList,
  userList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
