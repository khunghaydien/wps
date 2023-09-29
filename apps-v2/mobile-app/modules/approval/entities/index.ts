import { combineReducers } from 'redux';

import attendance from './attendance';
import expense from './expense';
import list from './list';

const rootReducer = {
  list,
  expense,
  attendance,
};

export default combineReducers(rootReducer);
