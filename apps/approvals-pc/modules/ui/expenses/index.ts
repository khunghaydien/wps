import { combineReducers } from 'redux';

import detail from './detail';
import dialog from './dialog';
import list from './list';

export default combineReducers({
  detail,
  list,
  dialog,
});
