import { Reducer } from 'redux';

import { VIEW_MODE } from '../../../../domain/models/exp/Report';

//
// constants
//
export const ACTIONS = {
  REPORT_LIST: 'MODULES/VIEW/REPORT_LIST',
  REPORT_DETAIL: 'MODULES/VIEW/REPORT_DETAIL',
};

//
// actions
//
export const actions = {
  setListView: () => ({
    type: ACTIONS.REPORT_LIST,
  }),
  setDetailView: () => ({
    type: ACTIONS.REPORT_DETAIL,
  }),
};
//
// Reducer
//
const initialState = VIEW_MODE.REPORT_LIST;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.REPORT_LIST:
      return VIEW_MODE.REPORT_LIST;
    case ACTIONS.REPORT_DETAIL:
      return VIEW_MODE.REPORT_DETAIL;
    default:
      return state;
  }
}) as Reducer<string, any>;
