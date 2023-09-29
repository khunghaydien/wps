import { Reducer } from 'redux';

import { $Values } from 'utility-types';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

export const ACTIONS = {
  SET: 'MODULES/APPROVAL/UI/EXPENSE/REQUEST_MODULE/SET',
};

type RequestModule = $Values<typeof EXPENSE_APPROVAL_REQUEST>;

// to set active request module(Request/Expense) under expense approval
export const actions = {
  set: (module: RequestModule) => ({
    type: ACTIONS.SET,
    payload: module,
  }),
};

const initialState = EXPENSE_APPROVAL_REQUEST.expense;

export default ((state: RequestModule = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<RequestModule, any>;
