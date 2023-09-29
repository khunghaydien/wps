import { Reducer } from 'redux';

export const ACTIONS = {
  SET_AVAILABLE_EXP_TYPE: 'SET_AVAILABLE_EXP_TYPE',
};

export const setAvailableExpType = (expenseType: Array<string>) => ({
  type: ACTIONS.SET_AVAILABLE_EXP_TYPE,
  payload: expenseType,
});

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_AVAILABLE_EXP_TYPE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
