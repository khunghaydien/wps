import { combineReducers } from 'redux';

import comment from './comment';
import error from './error';

export default combineReducers({
  comment,
  error,
});
