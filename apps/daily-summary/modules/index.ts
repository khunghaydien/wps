import { combineReducers } from 'redux';

import toast from '../../commons/modules/toast';
import common from '../../commons/reducers';

import entities from './entities';
import ui from './ui';

const rootReducer = {
  common,
  entities,
  ui,
  toast,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
