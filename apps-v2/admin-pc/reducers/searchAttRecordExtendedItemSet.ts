import { SEARCH_RECORD_EXTENDED_ITEM_SET } from '../actions/attRecordExtendedItemSet';

const initialState = [];

export default function searchLateArrivalEarlyLeaveReasonReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_RECORD_EXTENDED_ITEM_SET:
      return action.payload;
    default:
      return state;
  }
}
