import { combineReducers } from 'redux';

import grantHistoryList from './grant-history-list';

const reducers = combineReducers({
  grantHistoryList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
