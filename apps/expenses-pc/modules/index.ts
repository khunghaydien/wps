import { combineReducers } from 'redux';

import common from '../../commons/modules';
import currencyCodeList from '../../commons/reducers/currencyCodeList';
import userSetting from '../../commons/reducers/userSetting';

import entities from './entities';
import ui from './ui';

const reducers = {
  common,
  userSetting,
  ui,
  entities,
  currencyCodeList,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
