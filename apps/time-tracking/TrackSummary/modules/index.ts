import { combineReducers } from 'redux';

import app from '../../../commons/modules/app';
import toast from '../../../commons/modules/toast';
import common from '../../../commons/reducers';
import userSetting from '../../../commons/reducers/userSetting';

import entities from './entities';
import ui from './ui';
import widgets from './widgets';

const rootReducer = {
  app,
  common,
  entities,
  userSetting,
  ui,
  toast,
  widgets,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
