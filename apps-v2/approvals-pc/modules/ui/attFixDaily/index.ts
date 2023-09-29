import { combineReducers } from 'redux';

import checked from './checked';
import records from './records';
import request from './request';
import selectedId from './selectedId';

export default combineReducers({
  checked,
  records,
  selectedId,
  request,
});
