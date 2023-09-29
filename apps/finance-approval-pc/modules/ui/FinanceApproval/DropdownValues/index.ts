import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/UI/FINANCEAPPROVAL/DROPDOWNVALUES/SET',
};

export const actions = {
  set: (values: Array<string>) => ({
    type: ACTIONS.SET,
    payload: values,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
