import { combineReducers } from 'redux';

import requestSelection from '@apps/resource-pc/modules/ui/filter/requestSelection';
import roleRequest from '@apps/resource-pc/modules/ui/filter/roleRequest';
import resourceSelection from '@resource/modules/ui/filter/resourceSelection';
import viewAllResources from '@resource/modules/ui/filter/viewAllResources';

import project from './project';

export default combineReducers({
  project,
  viewAllResources,
  resourceSelection,
  requestSelection,
  roleRequest,
});
