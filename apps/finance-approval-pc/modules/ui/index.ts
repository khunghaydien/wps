import { combineReducers } from 'redux';

import expenses from '../../../expenses-pc/modules/ui/expenses';

import FinanceApproval from './FinanceApproval';

export default combineReducers({
  expenses,
  FinanceApproval,
});
