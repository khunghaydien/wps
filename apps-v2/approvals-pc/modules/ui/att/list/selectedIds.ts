import { Reducer } from 'redux';

const ACTIONS = {
  SET: 'MODULES/UI/ATT/LIST/SELECT_IDS/SET',
  REMOVE: 'MODULES/UI/ATT/LIST/SELECT_IDS/REMOVE',
  CLEAR: 'MODULES/UI/ATT/LIST/SELECT_IDS/CLEAR',
};

export const actions = {
  set: (ids: Array<string>) => ({
    type: ACTIONS.SET,
    payload: ids,
  }),
  remove: (id: string) => ({
    type: ACTIONS.REMOVE,
    payload: id,
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
    case ACTIONS.REMOVE:
      return state.filter((x) => x !== action.payload);
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
