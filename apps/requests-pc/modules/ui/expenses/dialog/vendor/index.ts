import { combineReducers } from 'redux';

import personal from './personalList';
import recentlyUsed from './recentlyUsed';
import search from './search';
import type from './type';

export default combineReducers({
  personal,
  type,
  search,
  recentlyUsed,
});
