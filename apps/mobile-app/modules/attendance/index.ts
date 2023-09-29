import { combineReducers } from 'redux';

import dailyRequest from './dailyRequest';
import mobileSetting from './mobileSetting';
import timesheet from './timesheet';
import timeStamp from './timeStamp';

const reducers = { timesheet, timeStamp, dailyRequest, mobileSetting };

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;
export default rootReducer;
