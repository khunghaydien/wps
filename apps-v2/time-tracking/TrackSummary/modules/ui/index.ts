import { combineReducers } from 'redux';

import blocking from './blocking';
import request from './request';

const rootReducer = {
  blocking,
  request,
};

export default combineReducers(rootReducer);
