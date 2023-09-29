import { Reducer } from 'redux';

import { AmountRangeOption } from '@commons/components/fields/DropdownAmountRange';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/AMOUNT/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT/LIST/ADV_SEARCH/AMOUNT/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/AMOUNT/REPLACE',
};

export const actions = {
  set: (amount: AmountRangeOption) => ({
    type: ACTIONS.SET,
    payload: amount,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  replace: (amount: AmountRangeOption) => ({
    type: ACTIONS.REPLACE,
    payload: amount,
  }),
};

//
// Reducer
//
const initialState = { minAmount: null, maxAmount: null };

export default ((state: AmountRangeOption = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const { minAmount, maxAmount } = action.payload;
      const amountRange = {
        minAmount: maxAmount && !minAmount ? 0 : minAmount,
        maxAmount,
      };
      return amountRange;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<AmountRangeOption, any>;
