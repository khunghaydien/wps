import { combineReducers } from 'redux';

import { ToastMessageType } from '@apps/time-tracking/time-tracking-charge-transfer-pc/constants/ToastMessageType';

import common from '@apps/commons/reducers';

import ui from './ui';
import widgets from './widgets';

const rootReducer = {
  common,
  ui,
  widgets,
};

const reducer = combineReducers(rootReducer);

export type State = ReturnType<typeof reducer> & {
  common: { toast: { options?: { messageType: ToastMessageType } } };
};

export default reducer;
