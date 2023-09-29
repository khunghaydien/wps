import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';
import exp from '@commons/modules/exp';

import entities from './entities';
import ui from './ui';
import widgets from './widgets';

const reducers = {
  common,
  exp,
  userSetting,
  entities,
  ui,
  widgets,
};

const rootReducer = combineReducers(reducers);

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
