import { combineReducers } from 'redux';

import customRequestList from './customRequestList';
import recordTypeList from './recordTypeList';
import requestDetail from './requestDetail';

const reducers = {
  customRequestList,
  recordTypeList,
  requestDetail,
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
