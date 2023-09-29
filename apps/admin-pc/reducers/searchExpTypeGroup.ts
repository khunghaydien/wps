import { SEARCH_EXPTYPEGROUP } from '../actions/expTypeGroup';

const initialState = [];

export default function searchExpTypeGroupReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_EXPTYPEGROUP:
      return action.payload;
    default:
      return state;
  }
}
