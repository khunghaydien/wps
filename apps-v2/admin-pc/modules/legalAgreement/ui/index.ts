import { combineReducers } from 'redux';

import detail from './detail';
import event from './event';
import list from './list';
import searchCondition from './searchCondition';
import specialEvent from './specialEvent';

const reducers = combineReducers({
  list,
  detail,
  searchCondition,
  event,
  specialEvent,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
