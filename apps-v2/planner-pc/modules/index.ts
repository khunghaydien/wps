import { combineReducers } from 'redux';

import common from '../../commons/reducers';
import userSetting from '../../commons/reducers/userSetting';

import psaEventPopup from '../../psa-pc/sub-apps/event-popoup/modules';

import { calendarMode, empEvents, selectedDay } from './calendar';
import entities from './entities';
import eventEditPopup from './eventEditPopup';
import ui from './ui';
import widgets from './widgets';

// eslint-disable-next-line no-unused-vars
function env(state: Record<string, any> = {}, _action: Record<string, any>) {
  return state;
}

const rootReducer = combineReducers({
  entities,
  env,
  common,
  userSetting,
  calendarMode,
  empEvents,
  selectedDay,
  eventEditPopup,
  ui,
  widgets,
  psaEventPopup,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
