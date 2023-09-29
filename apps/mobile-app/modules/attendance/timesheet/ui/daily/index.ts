import { combineReducers } from 'redux';

import editing from './editing';
import paging from './paging';

export default combineReducers({
  paging,
  editing,
});
