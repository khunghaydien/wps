import { combineReducers } from 'redux';

import advSearch from './advSearch';
import preRequest from './preRequest';
import preRequestIdList from './preRequestIdList';
import preRequestList from './preRequestList';
import report from './report';
import requestIdList from './requestIdList';
import requestList from './requestList';
import vendor from './vendor';

const rootReducer = {
  report,
  vendor,
  advSearch,
  requestIdList,
  requestList,
  preRequest,
  preRequestIdList,
  preRequestList,
};

export default combineReducers(rootReducer);
