import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';

import entities from './entities';

const rootReducers = combineReducers({
  common,
  userSetting,
  entities,
});

export type State = ReturnType<typeof rootReducers>;
export default rootReducers;
