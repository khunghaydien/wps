import { combineReducers } from 'redux';

import psa from '@apps/domain/modules/psa';
import departmentList from '@apps/psa-pc/modules/entities/departmentList';

import skillsetCategoryList from '@apps/admin-pc/reducers/searchCategory';
import employeeList from '@apps/admin-pc/reducers/searchEmployee';
import jobGradeList from '@apps/admin-pc/reducers/searchJobGrade';

export default combineReducers({
  psa,
  employeeList,
  skillsetCategoryList,
  jobGradeList,
  departmentList,
});
