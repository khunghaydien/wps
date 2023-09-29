import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';

import app from './app';

export default combineReducers({
  common,
  userSetting,
  app,
});
