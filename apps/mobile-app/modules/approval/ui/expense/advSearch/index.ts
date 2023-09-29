import { combineReducers } from 'redux';

import departmentBaseIds from './departmentBaseIds';
import empBaseIdList from './empBaseIdList';
import requestDateRange from './requestDateRange';
import statusList from './statusList';

export default combineReducers({
  statusList,
  empBaseIdList,
  requestDateRange,
  departmentBaseIds,
});
