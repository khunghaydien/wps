import { combineReducers } from 'redux';

import list from './list';
import memberList from './memberList';

const reducers = combineReducers({
  list,
  memberList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
