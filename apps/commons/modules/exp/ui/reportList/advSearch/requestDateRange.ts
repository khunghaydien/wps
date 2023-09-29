import { Reducer } from 'redux';

import { DateRangeOption } from '@commons/components/fields/DropdownDateRange';

import { requestDateInitVal } from '@apps/domain/models/exp/Report';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REQUEST_DATE/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REQUEST_DATE/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/REQUEST_DATE/REPLACE',
};

export const actions = {
  set: (requestDate: DateRangeOption) => ({
    type: ACTIONS.SET,
    payload: requestDate,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  replace: (requestDate: DateRangeOption) => ({
    type: ACTIONS.REPLACE,
    payload: requestDate,
  }),
};

const initialState = requestDateInitVal();

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
