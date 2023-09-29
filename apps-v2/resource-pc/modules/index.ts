import { combineReducers } from 'redux';

import common from '@apps/commons/reducers';
import userSetting from '@apps/commons/reducers/userSetting';

// common reducers
import entities from './entities';
// psa-specific reducers
import ui from './ui';

const reducers = {
  common,
  userSetting,
  ui,
  entities,
};

const rootReducer = combineReducers(reducers);

export type State = ReturnType<typeof rootReducer>;
export default rootReducer;
