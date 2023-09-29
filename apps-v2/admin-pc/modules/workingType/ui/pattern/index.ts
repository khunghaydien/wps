import { combineReducers } from 'redux';

import selectedPattern from './selectedPattern';
import selectedTable from './selectedTable';
import tab from './tab';

const reducers = combineReducers({
  selectedPattern,
  selectedTable,
  tab,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
