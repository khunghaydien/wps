import { combineReducers } from 'redux';

import orderBy from './orderBy';
import page from './page';
import selectedSearchCondition from './selectedSearchCondition';
import sortBy from './sortBy';

export default combineReducers({
  page,
  sortBy,
  orderBy,
  selectedSearchCondition,
});
