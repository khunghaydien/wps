import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/GENERAL/READONLY/SET',
};

export const actions = {
  set: (value: boolean) => ({
    type: ACTIONS.SET,
    payload: value,
  }),
};

const initialState = true;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
