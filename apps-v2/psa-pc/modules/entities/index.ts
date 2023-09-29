import { combineReducers } from 'redux';

import calendarList from '@apps/admin-pc/modules/calendar/entities/calendarList';
import psa from '@apps/domain/modules/psa';

import skillsetCategoryList from '@apps/admin-pc/reducers/searchCategory';
import employeeList from '@apps/admin-pc/reducers/searchEmployee';
import jobGradeList from '@apps/admin-pc/reducers/searchJobGrade';
import psaWorkSchemeList from '@apps/admin-pc/reducers/searchPsaWorkScheme';
import workArrangementList from '@apps/admin-pc/reducers/searchWorkArrangement';

import clientInfo from './clientInfo';
import customHint from './customHint';
import departmentList from './departmentList';

export default combineReducers({
  psa,
  employeeList,
  skillsetCategoryList,
  jobGradeList,
  psaWorkSchemeList,
  workArrangementList,
  calendarList,
  departmentList,
  clientInfo,
  customHint,
});
