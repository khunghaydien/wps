import { combineReducers } from 'redux';

import editing from './editing';
import paging from './paging';
import restTimeReasons from './restReasons';

export default combineReducers({
  paging,
  editing,
  restTimeReasons,
});
