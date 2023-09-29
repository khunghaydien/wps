import { combineReducers } from 'redux';

import filter from '@psa/modules/ui/filter';
import resourceAvailability from '@resource/modules/ui/resourceAvailability';
import resourceSelection from '@resource/modules/ui/resourceSelection';

import siteRoute from './siteRoute';

export default combineReducers({
  resourceAvailability,
  resourceSelection,
  filter,
  siteRoute,
});
