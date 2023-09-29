import { combineReducers } from 'redux';

import companyRequestCount from './companyRequestCount';
import detail from './detail';
import proxyEmpAccess from './proxyEmpAccess';

export default combineReducers({
  detail,
  companyRequestCount,
  proxyEmpAccess,
});
