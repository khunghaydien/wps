import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/ADV_SEARCH/TITLE/SET',
  CLEAR: 'MODULES/EXPENSE/UI/ADV_SEARCH/TITLE/CLEAR',
};

type SetAction = {
  type: string;
  payload: string;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (title: string): SetAction => ({
    type: ACTIONS.SET,
    payload: title,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

export const initialState = '';

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
