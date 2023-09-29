import { combineReducers } from 'redux';

import preRequest from '../../../../../domain/modules/exp/request/pre-request';
import report from '../../../../../domain/modules/exp/request/report';

export default combineReducers({
  report,
  preRequest,
});
