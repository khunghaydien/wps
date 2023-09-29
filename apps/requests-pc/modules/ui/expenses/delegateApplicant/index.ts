import { combineReducers } from 'redux';

import originalEmployee from './originalEmployee';
import selectedEmployee from './selectedEmployee';

export default combineReducers({
  selectedEmployee,
  originalEmployee,
});
