import { SEARCH_REPORTTYPE } from '../actions/reportType';

const initialState = [];

export default function searchReportTypeReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_REPORTTYPE:
      return action.payload;
    default:
      return state;
  }
}
