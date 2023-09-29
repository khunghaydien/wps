import { combineReducers } from 'redux';

import toast from '../../../commons/modules/toast';
import common from '../../../commons/reducers';

import user from './entities/user';
import ui from './ui';

const rootReducer = {
  common,
  ui,
  toast,
  user,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
