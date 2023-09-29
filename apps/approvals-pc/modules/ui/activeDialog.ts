import { Reducer } from 'redux';

const ACTIONS = {
  SET: 'MODULES/UI/ACTIVE_DIALOG/SET',
  HIDE: 'MODULES/UI/ACTIVE_DIALOG/CLEAR',
};

export const ACTIVE_DIALOG_TYPES = {
  BULK_APPROVAL_CONFIRM: 'BULK_APPROVAL_CONFIRM',
};

export const actions = {
  set: (type: string) => ({
    type: ACTIONS.SET,
    payload: type,
  }),
  hide: () => ({
    type: ACTIONS.HIDE,
  }),
};

const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.HIDE:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
