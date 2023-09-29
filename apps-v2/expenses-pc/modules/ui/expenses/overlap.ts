import { Reducer } from 'redux';

// Action constants
export const OVERLAP_REPORT = { report: true };
export const NON_OVERLAP_REPORT = {
  report: false,
  record: false,
};
export const OVERLAP_RECORD = { record: true };
export const NON_OVERLAP_RECORD = { record: false };

// Actions
export const ACTIONS = {
  OVERLAP_REPORT: 'MODULES/EXPENSES/OVERLAP/OVERLAP_REPORT',
  NON_OVERLAP_REPORT: 'MODULES/EXPENSES/OVERLAP/NON_OVERLAP_REPORT',
  OVERLAP_RECORD: 'MODULES/EXPENSES/OVERLAP/OVERLAP_RECORD',
  NON_OVERLAP_RECORD: 'MODULES/EXPENSES/OVERLAP/NON_OVERLAP_RECORD',
};

export const actions = {
  overlapReport: () => ({
    type: ACTIONS.OVERLAP_REPORT,
  }),
  nonOverlapReport: () => ({
    type: ACTIONS.NON_OVERLAP_REPORT,
  }),
  overlapRecord: () => ({
    type: ACTIONS.OVERLAP_RECORD,
  }),
  nonOverlapRecord: () => ({
    type: ACTIONS.NON_OVERLAP_RECORD,
  }),
};

// Reducer
const initialState = {
  report: false,
  record: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.OVERLAP_REPORT:
      return { ...state, ...OVERLAP_REPORT };
    case ACTIONS.NON_OVERLAP_REPORT:
      return { ...state, ...NON_OVERLAP_REPORT };
    case ACTIONS.OVERLAP_RECORD:
      return { ...state, ...OVERLAP_RECORD };
    case ACTIONS.NON_OVERLAP_RECORD:
      return { ...state, ...NON_OVERLAP_RECORD };
    default:
      return state;
  }
}) as Reducer<any, any>;
