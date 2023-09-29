import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import { $State } from '../../commons/utils/TypeUtil';

import entities from './entities';
import ui from './ui';

const rootReducer = {
  common,
  entities,
  ui,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
