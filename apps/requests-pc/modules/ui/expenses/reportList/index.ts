import { combineReducers } from 'redux';

import orderBy from './orderBy';
import page from './page';
import sortBy from './sortBy';

export default combineReducers({
  orderBy,
  page,
  sortBy,
});
