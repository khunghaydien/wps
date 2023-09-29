import { Reducer } from 'redux';

import { initialRequestListFilterState } from '@apps/domain/models/psa/Request';

//
// constants
//
export const ACTIONS = {
  UPDATE_FILTER: 'MODULES/UI/FILTER/REQUEST_SELECTION',
};

//
// actions
//
export const actions = {
  update: (nextState: any) => ({
    type: ACTIONS.UPDATE_FILTER,
    payload: nextState,
  }),
};

//
// Reducer
//
const initialState = initialRequestListFilterState;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_FILTER:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any, any>;
