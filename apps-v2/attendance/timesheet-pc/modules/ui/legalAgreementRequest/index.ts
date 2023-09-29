import { combineReducers } from 'redux';

import editing from './editing';
import list from './list';
import page from './page';
import requests from './requests';

const reducers = {
  editing,
  requests,
  page,
  list,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
