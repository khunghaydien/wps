import { combineReducers } from 'redux';

import approval from '../../../domain/modules/approval';
import exp from '../../../domain/modules/exp';
import financeApproval from '../../../domain/modules/exp/finance-approval';

import advSearchConditionList from './advSearchConditionList';
import companyList from './companyList';
import preRequestIdList from './preRequestIdList';
import preRequestList from './preRequestList';
import requestIdList from './requestIdList';
import requestList from './requestList';

export default combineReducers({
  exp,
  approval,
  financeApproval,
  preRequestIdList,
  preRequestList,
  requestIdList,
  requestList,
  advSearchConditionList,
  companyList,
});
