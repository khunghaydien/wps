import { SEARCH_EXTENDED_ITEM } from '../actions/extendedItem';

const initialState = [];

export default function searchExtendedItemReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_EXTENDED_ITEM:
      return action.payload;
    default:
      return state;
  }
}
