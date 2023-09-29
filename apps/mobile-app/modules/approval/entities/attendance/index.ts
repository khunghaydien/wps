import { combineReducers } from 'redux';

import request from './request';

const rootReducer = {
  request,
};

export default combineReducers(rootReducer);
