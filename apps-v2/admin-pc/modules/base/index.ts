import { combineReducers } from 'redux';

import detailPane from './detail-pane';
import listPane from './list-pane';
import menuPane from './menu-pane';

const reducers = combineReducers({
  detailPane,
  listPane,
  menuPane,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
