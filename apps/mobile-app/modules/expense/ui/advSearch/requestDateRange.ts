import { Reducer } from 'redux';

import { DateRangeOption } from '@apps/commons/components/fields/DropdownDateRange';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/ADV_SEARCH/REQUEST_DATE_RANGE/SET',
};

type SetAction = {
  type: string;
  payload: DateRangeOption;
};

export const actions = {
  set: (dateRange: DateRangeOption): SetAction => ({
    type: ACTIONS.SET,
    payload: dateRange,
  }),
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<DateRangeOption, any>;
