import { combineReducers } from 'redux';

import filterTerms from './filterTerms';
import selectedIds from './selectedIds';

export default combineReducers({
  selectedIds,
  filterTerms,
});
