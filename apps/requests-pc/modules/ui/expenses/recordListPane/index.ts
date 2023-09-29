import { combineReducers } from 'redux';

import recordList from './recordList';
import summary from './summary';

export default combineReducers({
  summary,
  recordList,
});
