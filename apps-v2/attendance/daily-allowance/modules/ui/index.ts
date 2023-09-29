import { combineReducers } from 'redux';

import blocking from './blocking';
import dailyAllowance from './dailyAllowance';

export default combineReducers({
  blocking,
  dailyAllowance,
});
