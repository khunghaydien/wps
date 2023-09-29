import { combineReducers } from 'redux';

import attendanceRequest from './attendanceRequest';
import dailyRequest from './dailyRequest';

const rootReducer = {
  attendanceRequest,
  dailyRequest,
};

export default combineReducers(rootReducer);
