import { combineReducers } from 'redux';

import plannerSetting from './plannerSetting';

const reducers = combineReducers({
  plannerSetting,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
