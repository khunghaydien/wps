import { Action, combineReducers } from 'redux';

import approval from './approval';
import exp from './exp';

export default combineReducers<Record<string, any>, Action<any>>({
  exp,
  approval,
});
