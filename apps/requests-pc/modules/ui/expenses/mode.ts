import { Reducer } from 'redux';

//
// constants
//
export const ACTIONS = {
  INITIALIZE: 'MODULES/MODE/INITIALIZE',
  REPORT_SELECT: 'MODULES/MODE/REPORT_SELECT',
  REPORT_EDIT: 'MODULES/MODE/REPORT_EDIT',
  REPORT_SAVE: 'MODULES/MODE/REPORT_SAVE',
};

export const modes = {
  INITIALIZE: 'INITIALIZE',
  REPORT_SELECT: 'REPORT_SELECT',
  REPORT_EDIT: 'REPORT_EDIT',
  REPORT_SAVE: 'REPORT_SAVE',
  FINANCE_REPORT_EDITED: 'FINANCE_REPORT_EDITED',
};

//
// actions
//
export const actions = {
  initialize: () => ({
    type: ACTIONS.INITIALIZE,
    payload: modes.INITIALIZE,
  }),
  reportSelect: () => ({
    type: ACTIONS.REPORT_SELECT,
    payload: modes.REPORT_SELECT,
  }),
  reportEdit: () => ({
    type: ACTIONS.REPORT_EDIT,
    payload: modes.REPORT_EDIT,
  }),
  reportSave: () => ({
    type: ACTIONS.REPORT_SAVE,
    payload: modes.REPORT_SAVE,
  }),
};

//
// Reducer
//
const initialState = modes.INITIALIZE;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.INITIALIZE:
    case ACTIONS.REPORT_SELECT:
    case ACTIONS.REPORT_EDIT:
    case ACTIONS.REPORT_SAVE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<string, any>;
