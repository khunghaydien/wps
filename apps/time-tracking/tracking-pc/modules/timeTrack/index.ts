import { combineReducers } from 'redux';

import allTaskSum from './allTaskSum';
import dailyTrackList from './dailyTrackList';
import overview from './overview';
import request from './request';
import selectedMonth from './selectedMonth';
import taskList from './taskList';

const timeTrackReducer = combineReducers({
  selectedMonth,
  overview,
  dailyTrackList,
  allTaskSum,
  taskList,
  request,
});
export default timeTrackReducer;
