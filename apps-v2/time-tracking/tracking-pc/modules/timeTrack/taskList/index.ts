import { combineReducers } from 'redux';

import allIds from './allIds';
import byId from './byId';

const timeTrackReducer = combineReducers({
  allIds,
  byId,
});
export default timeTrackReducer;
