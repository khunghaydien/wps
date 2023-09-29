import { Reducer } from 'redux';

export const ACTIONS = {
  TOGGLE: 'MODULES/UI/EXPENSES/RECORD_LIST_PANE/SUMMARY/TOGGLE',
  OPEN: 'MODULES/UI/EXPENSES/RECORD_LIST_PANE/SUMMARY/OPEN',
  CLOSE: 'MODULES/UI/EXPENSES/RECORD_LIST_PANE/SUMMARY/CLOSE',
};

const initialState = true;

export const actions = {
  toggle: () => {
    return {
      type: ACTIONS.TOGGLE,
    };
  },
  open: () => {
    return {
      type: ACTIONS.OPEN,
    };
  },
  close: () => {
    return {
      type: ACTIONS.CLOSE,
    };
  },
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE:
      return !state;
    case ACTIONS.OPEN:
      return true;
    case ACTIONS.CLOSE:
      return false;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
