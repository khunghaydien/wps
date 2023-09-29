import { Reducer } from 'redux';

export const ACTIONS = {
  TOGGLE_SHOW: 'MODULES/EXPENSE/UI/REPORT_TYPE_SELECT_DIALOG/TOGGLE_SHOW',
};

export const actions = {
  show: (isShow: boolean) => ({
    type: ACTIONS.TOGGLE_SHOW,
    payload: isShow,
  }),
};

const initialState = { isShow: false };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_SHOW:
      return { isShow: action.payload };
    default:
      return state;
  }
}) as Reducer<{ isShow: boolean }, any>;
