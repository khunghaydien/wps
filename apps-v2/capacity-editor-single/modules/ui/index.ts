import { combineReducers } from 'redux';

import psaWorkSchemeList from '@apps/admin-pc/reducers/searchPsaWorkScheme';
import workArrangementList from '@apps/admin-pc/reducers/searchWorkArrangement';

import availabilityList from './capacityEditorResourceAvailabilities';

export default combineReducers({
  psaWorkSchemeList,
  workArrangementList,
  availabilityList,
});
