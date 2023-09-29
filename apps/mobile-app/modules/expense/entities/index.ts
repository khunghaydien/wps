import { combineReducers } from 'redux';

import routeResults from '../../../../domain/modules/exp/jorudan/route';
import receiptLibrary from '../../../../domain/modules/exp/receiptLibrary';

import ccTransactions from './ccTransactions';
import icTransactions from './icTransactions';

import accountingPeriod from './accountingPeriod';
import advSearch from './advSearch';
import approvalHistory from './approvalHistory';
import childExpenseTypes from './childExpenseTypes';
import costCenterList from './costCenterList';
import customEIOption from './customEIOption';
import customHint from './customHint';
import customRequestList from './customRequestList';
import defaultCostCenterList from './defaultCostCenterList';
import empHistoryList from './empHistoryList';
import exchangeRate from './exchangeRate';
import expenseTypeList from './expenseTypeList';
import expReportType from './expReportType';
import fileMetadata from './fileMetadata';
import foreignCurrency from './foreignCurrency';
import icCard from './icCard';
import job from './jobList';
import recordItem from './recordItem';
import recordList from './recordList';
import report from './report';
import reportIdList from './reportIdList';
import reportList from './reportList';
import selectedReportType from './selectedReportType';
import taxType from './taxType';
import vendorList from './vendorList';

export default combineReducers({
  fileMetadata,
  receiptLibrary,
  reportList,
  reportIdList,
  taxType,
  foreignCurrency,
  exchangeRate,
  expenseTypeList,
  childExpenseTypes,
  recordList,
  recordItem,
  routeResults,
  report,
  icCard,
  icTransactions,
  ccTransactions,
  accountingPeriod,
  costCenterList,
  vendorList,
  customRequestList,
  approvalHistory,
  defaultCostCenterList,
  expReportType,
  job,
  customEIOption,
  customHint,
  selectedReportType,
  empHistoryList,
  advSearch,
});
