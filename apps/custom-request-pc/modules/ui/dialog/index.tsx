import { combineReducers } from 'redux';

import activeDialog from './activeDialog';
import layoutConfig from './layoutConfig';
import selectedRecordTypeId from './selectedRecordTypeId';

const reducers = {
  activeDialog,
  layoutConfig,
  selectedRecordTypeId,
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
