import { combineReducers } from 'redux';

import att from './att';
import attLegalAgreement from './attLegalAgreement';
import attMonthly from './attMonthly';
import delegateApprover from './delegateApprover';
import exp from './exp';
import expenses from './expenses';
import histories from './histories';
import timeTrack from './timeTrack';

export default combineReducers({
  att,
  attLegalAgreement,
  attMonthly,
  timeTrack,
  expenses,
  exp,
  delegateApprover,
  histories,
});
