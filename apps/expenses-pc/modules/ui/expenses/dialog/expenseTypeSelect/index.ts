import { combineReducers } from 'redux';

import list from './list';
import recordType from './recordType';

export default combineReducers({
  list,
  recordType,
});
