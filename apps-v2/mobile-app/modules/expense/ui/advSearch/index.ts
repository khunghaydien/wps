import { combineReducers } from 'redux';

import customRequestTypeList from './customRequestTypeList';
import empBaseIdList from './empBaseIdList';
import requestDateRange from './requestDateRange';
import statusList from './statusList';
import title from './title';

export default combineReducers({
  statusList,
  empBaseIdList,
  requestDateRange,
  customRequestTypeList,
  title,
});
