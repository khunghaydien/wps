import { SEARCH_EXTENDED_ITEM_CUSTOM } from '../actions/extendedItemCustom';

const initialState = [];

export default function searchExtendedItemCustomReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_EXTENDED_ITEM_CUSTOM:
      return action.payload;
    default:
      return state;
  }
}
