import { combineReducers } from 'redux';

import calendar from './calendar';
import calendarEvent from './calendarEvent';

const reducers = combineReducers({
  calendar,
  calendarEvent,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
