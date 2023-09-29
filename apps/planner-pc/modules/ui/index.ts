import { combineReducers } from 'redux';

import eventEditPopup from './eventEditPopup';
import eventListPopup from './eventListPopup';

export default combineReducers({
  eventListPopup,
  eventEditPopup,
});
