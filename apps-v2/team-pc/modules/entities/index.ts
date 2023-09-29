import { combineReducers } from 'redux';

import attSummary from './attSummary';
import attSummaryPeriodList from './attSummaryPeriodList';

export default combineReducers({
  attSummary,
  attSummaryPeriodList,
});
