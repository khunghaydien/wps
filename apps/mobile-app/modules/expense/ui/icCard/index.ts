import { combineReducers } from 'redux';

import selectedTransactions from './selectedTransactions';

import selectedCard from './selectedCard';

export default combineReducers({
  selectedCard,
  selectedTransactions,
});
