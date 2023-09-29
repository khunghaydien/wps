import { combineReducers } from 'redux';

import dialog from './dialog';
import status from './status';

export default combineReducers({
  dialog,
  status,
});
