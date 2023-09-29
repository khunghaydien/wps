import { combineReducers } from 'redux';

import isLoading from '@apps/commons/modules/psa/fetchingLoading';
import loadingMore from '@apps/commons/modules/psa/loadingMore';

import dialog from './dialog';
import filter from './filter';
import mode from './mode';
import overlap from './overlap';
import resourceAssignmentDetail from './resourceAssignmentDetail';
import resourceAvailability from './resourceAvailability';
import resourceSelection from './resourceSelection';
import siteRoute from './siteRoute';
import tab from './tab';

export default combineReducers({
  filter,
  dialog,
  overlap,
  siteRoute,
  mode,
  tab,
  resourceAvailability,
  resourceSelection,
  resourceAssignmentDetail,
  isLoading,
  loadingMore,
});
