import { combineReducers } from 'redux';

import isExpanded from './isExpanded';
import request from './request';

export default combineReducers({
  request,
  isExpanded,
});
