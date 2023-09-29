import { combineReducers } from 'redux';

import common from '@apps/commons/reducers';
import userSetting from '@apps/commons/reducers/userSetting';

import ui from './ui';

const rootReducer = combineReducers({
  common,
  userSetting,
  ui,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
