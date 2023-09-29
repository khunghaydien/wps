import { combineReducers } from 'redux';

import dailyTimeTrack from './dailyTimeTrack';
import timesheet from './timesheet';
import timeTrackAlert from './timeTrackAlert';

const reducers = {
  dailyTimeTrack,
  timesheet,
  timeTrackAlert,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
