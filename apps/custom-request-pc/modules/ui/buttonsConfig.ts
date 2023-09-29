import { Reducer } from 'redux';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/UI/BUTTONS_CONFIG/SET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/BUTTONS_CONFIG/CLEAR_SUCCESS',
};

export const actions = {
  set: (buttons) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: buttons,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string[], any>;
