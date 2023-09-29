import { combineReducers } from 'redux';

import dailyStampTime from './dailyStampTime';

const reducers = {
  dailyStampTime,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;
export default rootReducer;
