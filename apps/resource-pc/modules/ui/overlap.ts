import { Reducer } from 'redux';

// Action constants
export const OVERLAP = true;
export const NON_OVERLAP = false;

// Actions
export const ACTIONS = {
  OVERLAP: 'MODULES/UI/OVERLAP',
  NON_OVERLAP: 'MODULES/UI/NON_OVERLAP',
};

export const actions = {
  overlap: () => ({
    type: ACTIONS.OVERLAP,
  }),
  nonOverlap: () => ({
    type: ACTIONS.NON_OVERLAP,
  }),
};

// Reducer
const initialState = false;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.OVERLAP:
      return OVERLAP;
    case ACTIONS.NON_OVERLAP:
      return NON_OVERLAP;
    default:
      return state;
  }
}) as Reducer<any, any>;
