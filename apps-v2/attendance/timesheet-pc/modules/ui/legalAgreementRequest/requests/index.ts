import { combineReducers } from 'redux';

import monthlyRequest from './monthlyRequest';
import yearlyRequest from './yearlyRequest';

const reducers = {
  monthlyRequest,
  yearlyRequest,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
