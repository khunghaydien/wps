import { combineReducers } from 'redux';

import activeDialog from './activeDialog';
import approvalType from './approvalType';
import att from './att';
import attMonthly from './attMonthly';
import bulkApproval from './bulkApproval';
import companyCount from './companyCount';
import companyRequestCount from './companyRequestCount';
import delegateApprover from './delegateApprover';
import expenses from './expenses';
import isApexView from './isApexView';
import requestCounts from './requestCounts';
import tabs from './tabs';
import timeTrack from './timeTrack';

export default combineReducers({
  activeDialog,
  bulkApproval,
  tabs,
  requestCounts,
  approvalType,
  att,
  attMonthly,
  timeTrack,
  isApexView,
  expenses,
  delegateApprover,
  companyCount,
  companyRequestCount,
});
