import { combineReducers } from 'redux';

import event from './event';
import jobList from './jobList';
import workCategoryList from './workCategoryList';

const rootReducer = combineReducers({
  event,
  workCategoryList,
  jobList,
});

export default rootReducer;
