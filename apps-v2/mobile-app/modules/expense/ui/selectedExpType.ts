import { Reducer } from 'redux';

import { ExpenseType } from '../../../../domain/models/exp/ExpenseType';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/SELECTED_EXP_TYPE/SET',
  CLEAR: 'MODULES/EXPENSE/UI/SELECTED_EXP_TYPE/CLEAR',
};

export const actions = {
  set: (expType: ExpenseType) => ({
    type: ACTIONS.SET,
    payload: expType,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<ExpenseType | Record<string, never>, any>;
