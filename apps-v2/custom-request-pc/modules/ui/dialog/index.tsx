import { combineReducers } from 'redux';

import selectedReferenceRecords from '@commons/modules/customRequest/ui/selectedReferenceRecords';

import activeDialog from './activeDialog';
import layoutConfig from './layoutConfig';
import selectedRecordTypeId from './selectedRecordTypeId';

const reducers = {
  activeDialog,
  layoutConfig,
  selectedRecordTypeId,
  selectedReferenceRecords,
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
