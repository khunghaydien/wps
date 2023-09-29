import { SEARCH_ATT_EXTENDED_ITEM } from '../actions/attExtendedItem';

const initialState = [];

export default function searchAttExtendedItemReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_ATT_EXTENDED_ITEM:
      return action.payload;
    default:
      return state;
  }
}
