import { Reducer } from 'redux';

import { ExpTypeInfo } from '../../../../../domain/models/exp/expense-report-type/list';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/REPORT/LINKED_EXP_TYPE_LIST/SET',
};

export const setLinkedExpType = (expenseType: Array<ExpTypeInfo>) => ({
  type: ACTIONS.SET,
  payload: expenseType,
});

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Array<ExpTypeInfo>, any>;
