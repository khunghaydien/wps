import { combineReducers } from 'redux';

import entities from './entities';
import ui from './ui';

export const GET_CONSTANTS_CALENDAR = '';

export const actions = {
  getConstantsCalendar: () => ({
    type: GET_CONSTANTS_CALENDAR,
  }),
};

export default combineReducers({
  ui,
  entities,
});
