import { combineReducers } from 'redux';

import currency from './currency';
import exchangeRate from './exchangeRate';

export default combineReducers({
  exchangeRate,
  currency,
});
