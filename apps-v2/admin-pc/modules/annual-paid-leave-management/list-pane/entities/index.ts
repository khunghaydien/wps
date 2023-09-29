import { combineReducers } from 'redux';

import employeeList from './employee-list';

const reducers = combineReducers({
  employeeList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
