import { FETCH_APPROVAL_HISTORY_LIST } from '../actions/approvalHistoryList';

export default function approvalHistoryListReducer(state = [], action) {
  switch (action.type) {
    case FETCH_APPROVAL_HISTORY_LIST:
      return action.payload;
    default:
      return state;
  }
}
