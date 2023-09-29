import { combineReducers } from 'redux';

import statusList from './statusList';
import detail from './detail';
import requestDateRange from './requestDateRange';
import cardName from './cardName';

export default combineReducers({
  statusList,
  detail,
  requestDateRange,
  cardName,
});
