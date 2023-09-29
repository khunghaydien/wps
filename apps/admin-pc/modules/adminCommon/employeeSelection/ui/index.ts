import { combineReducers } from 'redux';

import searchCondition from './searchCondition';
import selection from './selection';

export default combineReducers({
  selection,
  searchCondition,
});
