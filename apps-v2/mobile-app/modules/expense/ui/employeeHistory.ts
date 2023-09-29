import { Reducer } from 'redux';

import { EmpHistory } from '@apps/domain/models/common/Employee';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/EMPLOYEE_HISTORY/SET',
};

export const actions = {
  set: (item: EmpHistory) => ({
    type: ACTIONS.SET,
    payload: item,
  }),
};

const initialState = {} as EmpHistory;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return { ...action.payload };
    default:
      return state;
  }
}) as Reducer<EmpHistory, any>;
