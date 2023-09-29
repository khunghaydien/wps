import { combineReducers } from 'redux';

import employeeList from './employee-list';
import leaveType from './leave-type';
import searchForm from './search-form';

export default combineReducers({
  leaveType,
  searchForm,
  employeeList,
});
