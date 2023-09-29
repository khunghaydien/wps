import { combineReducers } from 'redux';

import common from '@apps/commons/reducers';
import userSetting from '@apps/commons/reducers/userSetting';

import employeeMemberLinkConfig from '@apps/admin-pc/modules/employeeMemberLinkConfig';

import entities from './entities';
// psa-specific reducers
import ui from './ui';

const rootReducer = combineReducers({
  common,
  userSetting,
  ui,
  entities,
  employeeMemberLinkConfig,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
