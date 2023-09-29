import { combineReducers } from 'redux';

import backType from './backType';
import vendorId from './id';
import personal from './personalList';
import recentlyUsed from './recentlyUsed';
import search from './search';
import type from './type';

export default combineReducers({
  personal,
  type,
  search,
  recentlyUsed,
  backType,
  vendorId,
});
