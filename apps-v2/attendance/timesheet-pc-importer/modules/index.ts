import { combineReducers } from 'redux';

import common from './common';
import timesheet from './timesheet';
import widgets from './widgets';

const rootReducer = combineReducers({
  common,
  timesheet,
  widgets,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
