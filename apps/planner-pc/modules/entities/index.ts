import { combineReducers } from 'redux';

import events from './events';
import requestAlert from './requestAlert';
import timeTrackAlert from './timeTrackAlert';

const rootReducer = {
  events,
  timeTrackAlert,
  requestAlert,
};

export default combineReducers(rootReducer);
