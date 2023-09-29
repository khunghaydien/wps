import { combineReducers } from 'redux';

import requestSelection from './requestSelection';
import resourceSelection from './resourceSelection';
import roleRequest from './roleRequest';
import viewAllResources from './viewAllResources';

export default combineReducers({
  roleRequest,
  resourceSelection,
  viewAllResources,
  requestSelection,
});
