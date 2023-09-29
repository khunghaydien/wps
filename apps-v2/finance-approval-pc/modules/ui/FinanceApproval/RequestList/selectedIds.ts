import { Reducer } from 'redux';

const ACTIONS = {
  SET: 'MODULES/UI/FINANCE_APPROVAL/LIST/SELECT_IDS/SET',
  CLEAR: 'MODULES/UI/FINANCE_APPROVAL/LIST/SELECT_IDS/CLEAR',
};

/** Define actions */
export const actions = {
  set: (ids: Array<string>) => ({
    type: ACTIONS.SET,
    payload: ids,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
