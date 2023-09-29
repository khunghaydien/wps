import { combineReducers } from 'redux';

import { $State } from '../../../commons/utils/TypeUtil';

import entity from './entity';
import ui from './ui';

const rootReducer = {
  entity,
  ui,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
