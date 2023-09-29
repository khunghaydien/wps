import { combineReducers } from 'redux';

import filterTerms from './filterTerms';
import maxSelection from './maxSelection';
import selectedIds from './selectedIds';

export default combineReducers({
  selectedIds,
  maxSelection,
  filterTerms,
});
