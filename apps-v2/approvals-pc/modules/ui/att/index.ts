import { combineReducers } from 'redux';

import isExpanded from './isExpanded';
import list from './list';
import request from './request';

export default combineReducers({
  list,
  request,
  isExpanded,
});
