import { combineReducers } from 'redux';

import isLoading from '@apps/commons/modules/psa/fetchingLoading';
import loadingMore from '@apps/commons/modules/psa/loadingMore';

import resourceAssignmentDetail from '@resource/modules/ui/resourceAssignmentDetail';
import resourceAvailability from '@resource/modules/ui/resourceAvailability';
import resourceSelection from '@resource/modules/ui/resourceSelection';

import dialog from './dialog';
import filter from './filter';
import mode from './mode';
import sidebar from './sidebar';
import siteRoute from './siteRoute';
import tab from './tab';

export default combineReducers({
  siteRoute,
  sidebar,
  mode,
  tab,
  filter,
  dialog,
  resourceAvailability,
  resourceAssignmentDetail,
  resourceSelection,
  isLoading,
  loadingMore,
});
