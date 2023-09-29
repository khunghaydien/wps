import { combineReducers } from 'redux';

import common from '../../commons/modules';
import personalSetting from '../../commons/modules/personalSetting';
import userSetting from '../../commons/reducers/userSetting';
import { $State } from '../../commons/utils/TypeUtil';
import { default as mobileCommons } from './commons';

import approval from './approval';
import attendance from './attendance';
import expense from './expense';
import tracking from './tracking';

const rootReducer = {
  common,
  userSetting,
  attendance,
  approval,
  expense,
  mobileCommons,
  tracking,
  personalSetting,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
