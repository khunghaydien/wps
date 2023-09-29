import { combineReducers } from 'redux';

import att from './att';
import attMonthly from './attMonthly';
import delegateApprover from './delegateApprover';
import exp from './exp';
import expenses from './expenses';
import histories from './histories';
import timeTrack from './timeTrack';

export default combineReducers({
  att,
  attMonthly,
  timeTrack,
  expenses,
  exp,
  delegateApprover,
  histories,
});
