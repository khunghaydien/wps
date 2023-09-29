import { combineReducers } from 'redux';

import employeeList from './employee-list';
import searchForm from './search-form';

export default combineReducers({
  searchForm,
  employeeList,
});
