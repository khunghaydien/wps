import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/UI/BULK_APPROVAL/COMMENT/SET',
  CLEAR: 'MODULES/UI/BULK_APPROVAL/COMMENT/CLEAR',
};

export const actions = {
  set: (comment: string) => ({
    type: ACTIONS.SET,
    payload: comment,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
