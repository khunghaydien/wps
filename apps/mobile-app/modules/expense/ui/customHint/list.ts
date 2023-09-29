import { Reducer } from 'redux';

import union from 'lodash/union';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/CUSTOM_HINT/SET',
  CLEAR: 'MODULES/EXPENSE/UI/CUSTOM_HINT/CLEAR',
};

export const actions = {
  set: (fieldName: string) => ({
    type: ACTIONS.SET,
    payload: fieldName,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      if (state.includes(action.payload)) {
        return state.filter((x) => x !== action.payload);
      }

      return union(state, [action.payload]);
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
