import { combineReducers } from 'redux';

import departmentList from './departmentList';
import employeeList from './employeeList';

export default combineReducers({
  employeeList,
  departmentList,
});
