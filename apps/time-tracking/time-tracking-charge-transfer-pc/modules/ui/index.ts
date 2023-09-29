import { combineReducers } from 'redux';

import timeTrackingCharge from './timeTrackingCharge';

const rootReducer = {
  timeTrackingCharge,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
