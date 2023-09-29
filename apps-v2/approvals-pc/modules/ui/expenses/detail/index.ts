import { combineReducers } from 'redux';

import comment from './comment';
import recordsArea from './recordsArea';

export default combineReducers({
  comment,
  recordsArea,
});
