import { combineReducers } from 'redux';

import accessControl from '@commons/modules/accessControl';
import app from '@commons/modules/app';
import toast from '@commons/modules/toast';

import entities from './entities';
import ui from './ui';

const extractedCommonReducer = combineReducers({
  accessControl,
  app,
  toast,
});

const rootReducer = {
  common: extractedCommonReducer,
  ui,
  entities,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
