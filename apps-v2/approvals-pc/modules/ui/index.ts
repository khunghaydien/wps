import { combineReducers } from 'redux';

import activeDialog from './activeDialog';
import approvalType from './approvalType';
import att from './att';
import attFixDaily from './attFixDaily';
import attLegalAgreement from './attLegalAgreement';
import attMonthly from './attMonthly';
import bulkApproval from './bulkApproval';
import companyCount from './companyCount';
import companyRequestCount from './companyRequestCount';
import customRequest from './customRequest';
import delegateApprover from './delegateApprover';
import expenses from './expenses';
import isApexView from './isApexView';
import requestCounts from './requestCounts';
import sideFilePreview from './sideFilePreview';
import tabs from './tabs';
import timeTrack from './timeTrack';

export default combineReducers({
  activeDialog,
  bulkApproval,
  customRequest,
  tabs,
  requestCounts,
  approvalType,
  att,
  attMonthly,
  attFixDaily,
  attLegalAgreement,
  timeTrack,
  isApexView,
  expenses,
  delegateApprover,
  companyCount,
  companyRequestCount,
  sideFilePreview,
});
