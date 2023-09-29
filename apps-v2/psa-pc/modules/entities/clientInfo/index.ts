// combine reducer

// opportunity -> move physically
// client new file
//
import { combineReducers } from 'redux';

import client from './client';
import opportunity from './opportunity';

export default combineReducers({
  client,
  opportunity,
});
