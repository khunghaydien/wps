import { combineReducers } from 'redux';

import defaultCostCenter from './defaultCostCenter';
import latestCostCenter from './latestCostCenter';
import list from './list';

export default combineReducers({
  list,
  defaultCostCenter,
  latestCostCenter,
});
