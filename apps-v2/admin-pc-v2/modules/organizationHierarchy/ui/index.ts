import { combineReducers } from 'redux';

import revisionDialog from './revisionDialog';
import selectedHistory from './selectedHistory';

const reducers = combineReducers({
  selectedHistory,
  revisionDialog,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
