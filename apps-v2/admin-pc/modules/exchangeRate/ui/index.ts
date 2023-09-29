import { combineReducers } from 'redux';

import editingExchangeRate from './editingExchangeRate';

const reducers = combineReducers({
  editingExchangeRate,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
