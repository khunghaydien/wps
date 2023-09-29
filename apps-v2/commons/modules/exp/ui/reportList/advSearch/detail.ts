import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/EXTRA_CONDITIONS/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/EXTRA_CONDITIONS/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/EXTRA_CONDITIONS/REPLACE',
};

export const KEYS = {
  requestDateRange: 'requestDateRange',
  reportType: 'reportType',
  title: 'title', // keep it as title so that consistent with already saved data in FA
  amount: 'amount',

  accountingDate: 'accountingDate',
  reportNo: 'reportNo',
  vendor: 'vendor',

  costCenter: 'costCenter',
  extraConditions: 'extraConditions',

  financeStatusList: 'financeStatusList',
  employee: 'employee',
  department: 'department',
  statusList: 'statusList',
};

type ExtraConditions = Array<string>;

export const actions = {
  set: (condition: string) => ({
    type: ACTIONS.SET,
    payload: condition,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  replace: (details: ExtraConditions) => ({
    type: ACTIONS.REPLACE,
    payload: details,
  }),
};

const initialState = [];

export default ((state: ExtraConditions = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      let selectedConditions = [...state];
      const target = action.payload;
      if (typeof target === 'string') {
        if (!_.includes(state, target)) {
          selectedConditions.push(target);
        } else {
          _.pull(selectedConditions, target);
        }
      } else {
        selectedConditions = target;
      }
      return selectedConditions;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ExtraConditions, any>;
