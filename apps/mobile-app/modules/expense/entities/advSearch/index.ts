import { combineReducers } from 'redux';

import customRequestTypeList from './customRequestTypeList';
import employeeList from './employeeList';

export default combineReducers({
  customRequestTypeList,
  employeeList,
});
