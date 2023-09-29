import { combineReducers } from 'redux';

import common from '../../commons/reducers';

import client from './client';
import entities from './entities';
import ui from './ui/index';
import widgets from './widgets';

const reducers = {
  common,
  entities,
  client,
  ui,
  widgets,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
