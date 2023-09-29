import { combineReducers } from 'redux';

import detail from './detail';
import requests from './requests';
import validation from './validation';

const reducers = {
  detail,
  validation,
  requests,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
