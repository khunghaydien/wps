import { combineReducers } from 'redux';

import detailPane from './detailPane';

const reducers = combineReducers({
  detailPane,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
