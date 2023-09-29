import { combineReducers } from 'redux';

import common from '../../../commons/reducers';
import userSetting from '../../../commons/reducers/userSetting';

import timeTrack from './timeTrack';
import widgets from './widgets';

const rootReducer = {
  common,
  userSetting,
  timeTrack,
  widgets,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer>;

export default reducer;
