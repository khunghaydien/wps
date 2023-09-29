import { SET_TARGET_EMP_ID } from '../actions/targetEmpId';

export default function targetEmpIdReducer(state = '', action) {
  switch (action.type) {
    case SET_TARGET_EMP_ID:
      return action.payload;
    default:
      return state;
  }
}
