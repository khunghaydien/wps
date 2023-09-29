import { combineReducers } from 'redux';

import orderBy from './orderBy';
import page from './page';
import selectedIds from './selectedIds';
import selectedSearchCondition from './selectedSearchCondition';
import sortBy from './sortBy';

export default combineReducers({
  page,
  sortBy,
  orderBy,
  selectedSearchCondition,
  selectedIds,
});
