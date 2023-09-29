import { combineReducers } from 'redux';

import dailyAllowance from './dailyAllowance';
import dailyDeviatedReason from './dailyDeviatedReason';
import dailyTimeTrack from './dailyTimeTrack';
import objectivelyEventLog from './objectivelyEventLog';
import restTimeReasons from './restTimeReasons';
import stampWidget from './stampWidget';
import timesheet from './timesheet';
import timeTrackAlert from './timeTrackAlert';

const reducers = {
  dailyTimeTrack,
  stampWidget,
  timesheet,
  timeTrackAlert,
  dailyAllowance,
  objectivelyEventLog,
  restTimeReasons,
  dailyDeviatedReason,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
