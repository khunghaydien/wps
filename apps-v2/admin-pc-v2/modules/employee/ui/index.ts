import { combineReducers } from 'redux';

// import detail from './detail';
import detail from '@admin-pc/modules/employee/ui/detail';
import userDialog from '@admin-pc/modules/employee/ui/userDialog';

import departmentDialog from './departmentDialog';
import positionDialog from './positionDialog';
import searchCondition from './searchCondition';
import searchQuery from './searchQuery';
import workingTypeDialog from './workingTypeDialog';

const reducers = combineReducers({
  searchCondition,
  searchQuery,
  userDialog,
  departmentDialog,
  positionDialog,
  detail,
  workingTypeDialog,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
