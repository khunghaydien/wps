import { combineReducers } from 'redux';

import approvalHistories from './approvalHistories';
import availableRequests from './availableRequests';
import latestRequests from './latestRequests';

export default combineReducers({
  approvalHistories,
  availableRequests,
  latestRequests,
});
