import { Reducer } from 'redux';

import { DateRangeOption } from '@commons/components/fields/DropdownDateRange';

import { accountingDateInitVal } from '@apps/domain/models/exp/FinanceApproval';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/ACCOUNTING_DATE/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/ACCOUNTING_DATE/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/ACCOUNTING_DATE/REPLACE',
};

export const actions = {
  set: (requestDate: DateRangeOption) => ({
    type: ACTIONS.SET,
    payload: requestDate,
  }),
  replace: (recordDate: DateRangeOption) => ({
    type: ACTIONS.REPLACE,
    payload: recordDate,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = accountingDateInitVal;

export default ((state: DateRangeOption = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const startDate = action.payload.startDate || initialState.startDate;
      const endDate = action.payload.endDate || initialState.endDate;
      return {
        startDate,
        endDate,
      };
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<DateRangeOption, any>;
