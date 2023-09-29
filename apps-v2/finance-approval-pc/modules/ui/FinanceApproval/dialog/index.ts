import { combineReducers } from 'redux';

import activeDialog from './activeDialog';
import searchCondition from './searchCondition';

export default combineReducers({
  activeDialog,
  searchCondition,
});
