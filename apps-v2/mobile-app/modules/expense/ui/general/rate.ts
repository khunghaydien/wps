import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/GENERAL/RATE/SET',
  CLEAR: 'MODULES/EXPENSE/UI/GENERAL/RATE/CLEAR',
};

export const actions = {
  set: (values: number) => ({
    type: ACTIONS.SET,
    payload: values,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = 0;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return 0;
    default:
      return state;
  }
}) as Reducer<number, any>;
