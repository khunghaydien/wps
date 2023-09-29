import { combineReducers } from 'redux';

import access from './access';
import query from './query';
import recordDetail from './recordDetail';
import recordList from './recordList';
import selectedObj from './selectedObj';

export default combineReducers({
  access,
  selectedObj,
  recordList,
  recordDetail,
  query,
});
