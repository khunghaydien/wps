import { Reducer } from 'redux';

export const ACTIONS = {
  OPEN: 'MODULES/UI/EXPENSES/RECORD_LIST_PANE/RECORD_LIST/OPEN_EDIT_MENU/SET',
  CLOSE:
    'MODULES/UI/EXPENSES/RECORD_LIST_PANE/RECORD_LIST/OPEN_EDIT_MENU/CLEAR',
};

export const actions = {
  open: () => ({
    type: ACTIONS.OPEN,
  }),
  close: () => ({
    type: ACTIONS.CLOSE,
  }),
};

const initialState = false;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CLOSE:
      return false;
    case ACTIONS.OPEN:
      return true;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
