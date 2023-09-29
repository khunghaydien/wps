import { combineReducers } from 'redux';

import allocateDic from './allocateDic';
import basicSetting from './basicSetting';
import blocking from './blocking';

export default combineReducers({
  allocateDic,
  basicSetting,
  blocking,
});
