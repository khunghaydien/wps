import { combineReducers } from 'redux';

import detail from './detail';
import searchCondition from './searchCondition';
import searchQuery from './searchQuery';
import userDialog from './userDialog';

const reducers = combineReducers({
  searchCondition,
  searchQuery,
  detail,
  userDialog,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
