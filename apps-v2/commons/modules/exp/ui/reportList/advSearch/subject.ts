import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/TITLE/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/TITLE/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/TITLE/REPLACE',
};

export const actions = {
  set: (title: string) => ({
    type: ACTIONS.SET,
    payload: title,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  replace: (title: string) => ({
    type: ACTIONS.SET,
    payload: title,
  }),
};

//
// Reducer
//
const initialState = null;

export default ((state: string = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const setValue = action.payload || null;
      return setValue;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      const value = action.payload || '';
      return value;
    default:
      return state;
  }
}) as Reducer<string | null | undefined, any>;
