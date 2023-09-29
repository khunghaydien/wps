import { combineReducers } from 'redux';

import editing from './editing';
import requests from './requests';
import targetDate from './targetDate';

const reducers = {
  targetDate,
  editing,
  requests,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
