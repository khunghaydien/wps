import { combineReducers } from 'redux';

import departmentSelectDialog from './departmentSelectDialog';
import periods from './periods';
import table from './table';

export default combineReducers({
  periods,
  table,
  departmentSelectDialog,
});
