import { combineReducers } from 'redux';

import employeeList from './employee-list';
import leaveTypes from './leave-types';

export default combineReducers({
  leaveTypes,
  employeeList,
});
