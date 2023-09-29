import { FETCH_EXP_TYPE_LIST } from '../actions/expTypeList';

export default function expTypeListReducer(state = [], action) {
  switch (action.type) {
    case FETCH_EXP_TYPE_LIST:
      return action.payload;
    default:
      return state;
  }
}
