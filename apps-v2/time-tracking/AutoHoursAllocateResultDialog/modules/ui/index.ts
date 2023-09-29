import { combineReducers } from 'redux';

import allocateResult from './allocateResult';
import blocking from './blocking';

export default combineReducers({
  allocateResult,
  blocking,
});
