import { Reducer } from 'redux';

import { UserSetting } from '../../../../../domain/models/UserSetting';

export const ACTIONS = {
  SET: 'MODULES/UI/EXPENSES/DELEGATE_APPLICANT/ORIGINAL_EMPLOYEE/SET',
  CLEAR: 'MODULES/UI/EXPENSES/DELEGATE_APPLICANT/ORIGINAL_EMPLOYEE/CLEAR',
};

export const actions = {
  set: (selectedEmp: UserSetting) => ({
    type: ACTIONS.SET,
    payload: selectedEmp,
  }),
  clear: () => ({ type: ACTIONS.CLEAR }),
};

const initialState = {};

// @ts-ignore
// FIXME Type state
export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<UserSetting, any>;
