import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/UI/FINANCEAPPROVAL/REQUESTLIST/SELECTEDSEARCHCONDITION/SET',
};

export const actions = {
  set: (selectedSearchCondition: string) => ({
    type: ACTIONS.SET,
    payload: selectedSearchCondition,
  }),
};

const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<string, any>;
