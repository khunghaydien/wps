import { combineReducers } from 'redux';

import openNowList from './openNowList';
import selectedRecord from './selectedRecord';

export default combineReducers({
  openNowList,
  selectedRecord,
});
