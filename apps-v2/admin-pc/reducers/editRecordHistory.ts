import { INITIALIZE, SET_EDIT_RECORD_HISTORY } from '../actions/editRecord';

import { convertForView } from '../utils/RecordUtil';

const initialState = {};

export default function editRecordReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE:
      return initialState;
    case SET_EDIT_RECORD_HISTORY:
      return convertForView(action.payload);
    default:
      return state;
  }
}
