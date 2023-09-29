import { combineReducers } from 'redux';

import { $State } from '../../../../commons/utils/TypeUtil';

import dailyTask from './dailyTask';
import dailyTaskJob from './dailyTaskJob';
import jobs from './jobs';

const rootReducer = {
  dailyTask,
  dailyTaskJob,
  jobs,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
