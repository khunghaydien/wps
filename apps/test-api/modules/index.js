import { combineReducers } from 'redux';

import common from '../../commons/modules';
import userSetting from '../../commons/reducers/userSetting';

import response from './response';

export default combineReducers({
  common,
  userSetting,
  response,
});
