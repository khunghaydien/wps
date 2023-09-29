import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REPORT_TYPE_IDS/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REPORT_TYPE_IDS/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REPORT_TYPE_IDS/REPLACE',
};

type ReportTypeIds = Array<string>;

export const actions = {
  set: (reportTypeId: string | string[]) => ({
    type: ACTIONS.SET,
    payload: reportTypeId,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  replace: (reportTypeIds: Array<string>) => ({
    type: ACTIONS.REPLACE,
    payload: reportTypeIds,
  }),
};

const initialState = [];

export default ((state: ReportTypeIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const newReportTypeList = [...state];
      const target = action.payload;
      if (!_.includes(state, target)) {
        newReportTypeList.push(target);
      } else {
        _.pull(newReportTypeList, target);
      }
      return newReportTypeList;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ReportTypeIds, any>;
