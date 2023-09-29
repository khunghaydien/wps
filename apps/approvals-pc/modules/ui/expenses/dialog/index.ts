import { combineReducers } from 'redux';

import activeDialog from './activeDialog';
import vendor from './vendor';

export default combineReducers({
  activeDialog,
  vendor,
});
