import { combineReducers } from 'redux';

import { $State } from '../../../../commons/utils/TypeUtil';

import dailyTask from './dailyTask';
import jobs from './jobs';
import workCategories from './workCategories';

const rootReducer = {
  dailyTask,
  jobs,
  workCategories,
};

export type State = $State<typeof rootReducer>;

export default combineReducers(rootReducer);
