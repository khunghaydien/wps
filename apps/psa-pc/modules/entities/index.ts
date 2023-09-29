import { combineReducers } from 'redux';

import calendarList from '@apps/admin-pc/modules/calendar/entities/calendarList';
import psa from '@apps/domain/modules/psa';

import skillsetCategoryList from '@apps/admin-pc/reducers/searchCategory';
import employeeList from '@apps/admin-pc/reducers/searchEmployee';
import jobGradeList from '@apps/admin-pc/reducers/searchJobGrade';

import departmentList from './departmentList';

export default combineReducers({
  psa,
  employeeList,
  skillsetCategoryList,
  jobGradeList,
  calendarList,
  departmentList,
});
