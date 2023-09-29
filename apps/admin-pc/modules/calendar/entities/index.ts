import { combineReducers } from 'redux';

import calendarEventList from './calendarEventList';
import calendarList from './calendarList';

const reducers = combineReducers({
  calendarList,
  calendarEventList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
