import { Action, combineReducers } from 'redux';

import request from './request';

export default combineReducers<Record<string, any>, Action<any>>({
  request,
});
