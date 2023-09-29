import { combineReducers } from 'redux';

import buttonsConfig from './buttonsConfig';
import dialog from './dialog';
import layoutConfig from './layoutConfig';
import layoutDetailInfo from './layoutDetailInfo';
import pageView from './pageView';
import selectedId from './selectedId';
import selectedRecordTypeId from './selectedRecordTypeId';

const reducers = {
  dialog,
  pageView,
  selectedId,
  buttonsConfig,
  layoutConfig,
  layoutDetailInfo,
  selectedRecordTypeId,
};

const rootReducer = combineReducers(reducers);
export default rootReducer;
