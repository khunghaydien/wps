import { Reducer } from 'redux';

import { Delegator } from '../../../../../domain/models/exp/DelegateApplicant';

export const ACTIONS = {
  SET: 'MODULES/UI/EXPENSES/DELEGATE_APPLICANT/SELECTED_EMPLOYEE/SET',
  CLEAR: 'MODULES/UI/EXPENSES/DELEGATE_APPLICANT/SELECTED_EMPLOYEE/CLEAR',
};

export const actions = {
  set: (selectedEmp: Delegator) => ({
    type: ACTIONS.SET,
    payload: selectedEmp,
  }),
  clear: () => ({ type: ACTIONS.CLEAR }),
};

const initialState = {} as Delegator;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Delegator, any>;
