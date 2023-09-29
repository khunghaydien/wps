import { combineReducers } from 'redux';

import availableExpType from './availableExpType';
import childList from './childList';
import list from './list';

export default combineReducers({
  availableExpType,
  list,
  childList,
});
