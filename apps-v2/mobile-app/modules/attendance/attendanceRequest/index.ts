import { combineReducers } from 'redux';

import history from './history';
import request from './request';
import warning from './warning';

const reducers = {
  history,
  request,
  warning,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;
export default rootReducer;
