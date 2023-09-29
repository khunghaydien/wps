import { HIDE_DIALOG, SHOW_DIALOG } from '../actions/dialog';

const initialState = { show: false };

export default function dialogReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_DIALOG:
      return action.payload;
    case HIDE_DIALOG:
      return initialState;
    default:
      return state;
  }
}
