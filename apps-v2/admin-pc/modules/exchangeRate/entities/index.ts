import { combineReducers } from 'redux';

import exchangeRateList from './exchangeRateList';

const reducers = combineReducers({
  exchangeRateList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
