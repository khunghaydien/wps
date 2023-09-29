import {
  INITIALIZE,
  SET_EDIT_RECORD_HISTORY,
  SET_TMP_EDIT_RECORD_HISTORY,
  SET_TMP_EDIT_RECORD_HISTORY_BY_KEY_VALUE,
} from '../actions/editRecord';

import { convertForView } from '../utils/RecordUtil';

const initialState = {};

export default function editRecordReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE:
      return initialState;
    case SET_EDIT_RECORD_HISTORY:
    case SET_TMP_EDIT_RECORD_HISTORY:
      return convertForView(action.payload);
    case SET_TMP_EDIT_RECORD_HISTORY_BY_KEY_VALUE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
}
