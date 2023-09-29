import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';

// common reducers
import entities from './entities';
import ui from './ui';
// psa-specific reducers
const reducers = {
  common,
  userSetting,
  entities,
  ui,
};

// FIXME: Use combineReducer to build the rootReducer
// @ts-ignore
export type State = ReturnType<typeof reducers>;
export default combineReducers(reducers);
