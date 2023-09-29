import { Reducer } from 'redux';

import {
  ORDER_BY,
  OrderBy,
} from '../../../../../domain/models/exp/FinanceApproval';

export const ACTIONS = {
  SET: 'MODULES/UI/FINANCEAPPROVAL/REQUESTLIST/ORDER_BY/SET',
};

export const PAGE_SIZE = 25;

export const actions = {
  set: (orderBy: OrderBy) => ({
    type: ACTIONS.SET,
    payload: orderBy,
  }),
};

const initialState = ORDER_BY.Asc as OrderBy;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<OrderBy, any>;
