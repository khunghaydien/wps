import { combineReducers } from 'redux';

import page from './page';
import selectedIds from './selectedIds';

export default combineReducers({
  page,
  selectedIds,
});
