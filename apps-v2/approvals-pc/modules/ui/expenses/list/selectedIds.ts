import { Reducer } from 'redux';

const ACTIONS = {
  SET: 'MODULES/ENTITIES/EXPENSES/LIST/SELECT_IDS/SET',
  PUSH: 'MODULES/ENTITIES/EXPENSES/LIST/SELECT_IDS/PUSH',
  CLEAR: 'MODULES/ENTITIES/EXPENSES/LIST/SELECT_IDS/CLEAR',
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
    case ACTIONS.PUSH:
      state.push(action.payload);
      return state;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
