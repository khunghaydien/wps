import { combineReducers } from 'redux';

import daily from './daily';
import monthly from './monthly';

export default combineReducers({
  daily,
  monthly,
});
