import { combineReducers } from 'redux';

import request from './request';
import requestAlert from './requestAlert';
import requestSummary from './requestSummary';
import summary from './summary';
import user from './user';

const rootReducer = {
  summary,
  requestSummary,
  requestAlert,
  request,
  user,
};

export default combineReducers(rootReducer);
