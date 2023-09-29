import { Reducer } from 'redux';

import { dropRight } from 'lodash';

//
// constants
//
export const ACTIONS = {
  HIDE: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE',
  HIDE_ALL: 'MODULES/DIALOG/ACTIVE_DIALOG/HIDE_ALL',
};

//
// actions
//
export const actions = {
  hide: () => ({
    type: ACTIONS.HIDE,
  }),
  hideAll: () => ({
    type: ACTIONS.HIDE_ALL,
  }),
};

//
// Reducer
//
const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.HIDE:
      return dropRight(state);
    case ACTIONS.HIDE_ALL:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
