import { combineReducers } from 'redux';

import approval from './approval';
import costCenter from './cost-center';
import customHint from './customHint';
import delegateApplicant from './delegateApplicant';
import empHistoryList from './empHistoryList';
import employeeHistory from './employeeHistory';
import expenseReportType from './expense-report-type';
import expenseType from './expense-type';
import financeApproval from './finance-approval';
import financeApprovalPreRequest from './financeApprovalPreRequest';
import jorudan from './jorudan';
import mileageRate from './mileageRate';
import personalVendor from './personalVendor';
import preRequest from './pre-request';
import receiptLibrary from './receiptLibrary';
import record from './record';
import report from './report';
import request from './request';
import taxType from './taxType';
import usedIn from './usedIn';
import userSettingMap from './userSettingMap';

const rootReducer = combineReducers({
  record,
  report,
  request,
  approval,
  customHint,
  preRequest,
  jorudan,
  expenseReportType,
  expenseType,
  taxType,
  receiptLibrary,
  financeApproval,
  financeApprovalPreRequest,
  costCenter,
  delegateApplicant,
  personalVendor,
  empHistoryList,
  employeeHistory,
  usedIn,
  userSettingMap,
  mileageRate,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
