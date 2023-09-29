import { combineReducers } from 'redux';

import accountingPeriod from './accountingPeriod';
import recordList from './recordList';
import summary from './summary';

export default combineReducers({
  summary,
  recordList,
  accountingPeriod,
});
