import { combineReducers } from 'redux';

import selectedReferenceRecords from '@commons/modules/customRequest/ui/selectedReferenceRecords';

import layoutConfigList from './layoutConfigList';

export default combineReducers({
  layoutConfigList,
  selectedReferenceRecords,
});
