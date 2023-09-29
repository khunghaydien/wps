import { combineReducers } from 'redux';

import companyDetails from './company';
import costCenterList from './costCenterList';
import departmentList from './departmentList';
import employeeDetails from './employeeDetail';
import employeeList from './employeeList';
import events from './events';
import fileMetadata from './fileMetadata';
import paymentMethodList from './paymentMethodList';
import reportTypeList from './reportTypeList';
import vendorList from './vendorList';

export default combineReducers({
  employeeList,
  events,
  costCenterList,
  departmentList,
  paymentMethodList,
  vendorList,
  fileMetadata,
  reportTypeList,
  employeeDetails,
  companyDetails,
});
