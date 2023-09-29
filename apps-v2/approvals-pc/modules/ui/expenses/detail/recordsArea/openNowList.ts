import { Reducer } from 'redux';

export const ACTIONS = {
  INITILIZE: 'MODULES/UI/EXPENSES/DETAIL/COMMENT/INITILIZE',
  TOGGLE_ITEM: 'MODULES/UI/EXPENSES/DETAIL/COMMENT/TOGGLE_ITEM',
  CLEAR: 'MODULES/UI/EXPENSES/DETAIL/COMMENT/CLEAR',
};

export const actions = {
  initialize: (toggleList: { [key: string]: boolean }) => ({
    type: ACTIONS.INITILIZE,
    payload: toggleList,
  }),
  set: (item: { [key: string]: boolean }) => ({
    type: ACTIONS.TOGGLE_ITEM,
    payload: item,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.INITILIZE:
      return action.payload;
    case ACTIONS.TOGGLE_ITEM:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<
  {
    [key: string]: boolean;
  },
  any
>;
