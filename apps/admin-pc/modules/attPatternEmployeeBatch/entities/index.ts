import { combineReducers } from 'redux';

import batchResultList from './batchResultList';
import employeePatternList from './employeePatternList';

const reducers = combineReducers({
  batchResultList,
  employeePatternList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
