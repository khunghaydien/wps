import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';

import entities from './entities';

const reducers = {
  common,
  userSetting,
  entities,
};

const rootReducer = combineReducers(reducers);

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
