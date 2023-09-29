import { SEARCH_EXTENDED_ITEM_PSA } from '../actions/extendedItemPSA';

const initialState = [];

export default function searchExtendedItemReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_EXTENDED_ITEM_PSA:
      return action.payload;
    default:
      return state;
  }
}
