import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';

import entities from './entities';
import ui from './ui';

const rootReducer = combineReducers({
  common,
  userSetting,
  ui,
  entities,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
