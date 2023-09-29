import { combineReducers } from 'redux';

// import baseRecord from './baseRecord';
import baseRecord from '@admin-pc/modules/employee/entities/baseRecord';
import historyRecordList from '@admin-pc/modules/employee/entities/historyRecordList';
import userList from '@admin-pc/modules/employee/entities/userList';

import ids from './ids';
import list from './list';

const reducers = combineReducers({
  list,
  ids,
  userList,
  baseRecord,
  historyRecordList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
