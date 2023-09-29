import { combineReducers } from 'redux';

import list from './list';
import recordUpdatedInfo from './recordUpdatedInfo';

export default combineReducers({
  list,
  recordUpdatedInfo,
});
