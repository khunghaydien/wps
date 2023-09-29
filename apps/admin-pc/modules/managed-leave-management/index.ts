import { combineReducers } from 'redux';

import detailPane from './detail-pane';
import listPane from './list-pane';
import updateDialog from './update-dialog';

const reducers = combineReducers({
  listPane,
  detailPane,
  updateDialog,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
