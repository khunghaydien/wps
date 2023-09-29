import { Reducer } from 'redux';

import _ from 'lodash';

import { financeStatusListInitParam } from '@apps/domain/models/exp/FinanceApproval';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/FINANCIAL_STATUS_LIST/SET',
  RESET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/FINANCIAL_STATUS_LIST/RESET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/FINANCIAL_STATUS_LIST/CLEAR',
  REPLACE:
    'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/FINANCIAL_STATUS_LIST/REPLACE',
};

type FinancialStatuses = Array<string>;

export const actions = {
  set: (financialStatus: string) => ({
    type: ACTIONS.SET,
    payload: financialStatus,
  }),
  replace: (financialStatuses: Array<string>) => ({
    type: ACTIONS.REPLACE,
    payload: financialStatuses,
  }),
  reset: () => ({
    type: ACTIONS.RESET,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//

export default ((
  state: FinancialStatuses = financeStatusListInitParam,
  action
) => {
  switch (action.type) {
    case ACTIONS.SET:
      const newStatusList = _.cloneDeep(state);

      const target = action.payload;
      if (!_.includes(state, target)) {
        newStatusList.push(target);
      } else {
        _.pull(newStatusList, target);
      }

      return newStatusList;
    case ACTIONS.RESET:
      return financeStatusListInitParam;
    case ACTIONS.CLEAR:
      return [];
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<FinancialStatuses, any>;
