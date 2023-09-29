import { combineReducers } from 'redux';

import costCenterList from './costCenterList';
import departmentList from './departmentList';
import employeeList from './employeeList';
import fileMetadata from './fileMetadata';
import reportTypeList from './reportTypeList';
import vendorList from './vendorList';

export default combineReducers({
  employeeList,
  costCenterList,
  departmentList,
  vendorList,
  fileMetadata,
  reportTypeList,
});
