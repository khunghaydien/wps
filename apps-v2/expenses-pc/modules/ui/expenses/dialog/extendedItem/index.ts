import { combineReducers } from 'redux';

import recentlyUsed from './recentlyUsed';
import search from './search';

export default combineReducers({
  search,
  recentlyUsed,
});
