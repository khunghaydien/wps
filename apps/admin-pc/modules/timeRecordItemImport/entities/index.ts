import { combineReducers } from 'redux';

import importResultList from './importResultList';

const reducers = combineReducers({
  importResultList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
