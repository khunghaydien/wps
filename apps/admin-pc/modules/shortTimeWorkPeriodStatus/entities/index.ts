import { combineReducers } from 'redux';

import shortTimeWorkPeriodStatusList from './shortTimeWorkPeriodStatusList';

const reducers = combineReducers({
  shortTimeWorkPeriodStatusList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
