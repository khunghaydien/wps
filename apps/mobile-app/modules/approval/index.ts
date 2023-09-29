import { combineReducers } from 'redux';

import { $State } from '../../../commons/utils/TypeUtil';

import entities from './entities';
import ui from './ui';

const rootReducer = {
  ui,
  entities,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
