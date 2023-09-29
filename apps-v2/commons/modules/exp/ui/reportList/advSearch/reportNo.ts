import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REPORT_NO/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REPORT_NO/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REPORT_NO/REPLACE',
};

export const actions = {
  set: (reportNo: string) => ({
    type: ACTIONS.SET,
    payload: reportNo,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  replace: (reportNo: string) => ({
    type: ACTIONS.REPLACE,
    payload: reportNo,
  }),
};

const initialState = null;

export default ((state: string = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload || null;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      const replaceValue = action.payload === '' ? null : action.payload;
      return replaceValue;
    default:
      return state;
  }
}) as Reducer<string | null | undefined, any>;
