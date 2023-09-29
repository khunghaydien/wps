import { combineReducers } from 'redux';

import assignment from './assignment';
import assignmentList from './assignmentList';
import detail from './detail';
import jobTypeDialog from './jobTypeDialog';
import searchCondition from './searchCondition';
import searchQuery from './searchQuery';

const reducers = combineReducers({
  assignment,
  assignmentList,
  detail,
  jobTypeDialog,
  searchCondition,
  searchQuery,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
