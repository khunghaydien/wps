import { combineReducers } from 'redux';

import inputError from './inputError';
import name from './name';

export default combineReducers({
  name,
  inputError,
});
