import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';

import entities from './entities';

const rootReducer = combineReducers({
  common,
  userSetting,
  entities,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
