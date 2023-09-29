import { Reducer } from 'redux';

const ACTIONS = {
  SET: 'MODULES/UI/IS_APEX_VIEW/SET',
};

export const actions = {
  set: () => ({
    type: ACTIONS.SET,
    payload: true,
  }),
};

const initialState = false;

// This module is true when we open detail screen in apex view
export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
