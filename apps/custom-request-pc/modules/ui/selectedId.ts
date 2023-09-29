import { Reducer } from 'redux';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/UI/SELECTED_ID/SET',
  CLEAR_SUCCESS: 'MODULES/CLEAR_SUCCESS',
};

export const actions = {
  set: (id: string) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: id,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
