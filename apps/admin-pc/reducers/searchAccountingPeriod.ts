import { SEARCH_ACCOUNTING_PERIOD } from '../actions/accountingPeriod';

const initialState = [];

export default function searchAccountingPeriodReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_ACCOUNTING_PERIOD:
      return action.payload;
    default:
      return state;
  }
}
