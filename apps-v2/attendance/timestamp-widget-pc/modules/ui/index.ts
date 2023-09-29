import { combineReducers } from 'redux';

import comment from './comment';
import modal from './modal';

export default combineReducers({
  comment,
  modal,
});
