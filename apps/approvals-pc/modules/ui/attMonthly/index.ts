import { combineReducers } from 'redux';

import detail from './detail';
import isExpanded from './isExpanded';
import list from './list';

export default combineReducers({
  detail,
  list,
  isExpanded,
});
