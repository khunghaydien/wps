import { combineReducers } from 'redux';

import absenceRequest from './absenceRequest';
import directRequest from './directRequest';
import earlyLeaveRequest from './earlyLeaveRequest';
import earlyStartWorkRequest from './earlyStartWorkRequest';
import holidayWorkRequest from './holidayWorkRequest';
import lateArrivalRequest from './lateArrivalRequest';
import leaveRequest from './leaveRequest';
import overtimeWorkRequest from './overtimeWorkRequest';
import patternRequest from './patternRequest';

const reducers = {
  absenceRequest,
  directRequest,
  earlyStartWorkRequest,
  holidayWorkRequest,
  lateArrivalRequest,
  earlyLeaveRequest,
  leaveRequest,
  overtimeWorkRequest,
  patternRequest,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
