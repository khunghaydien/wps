import {
  INITIALIZE,
  SET_EDIT_RECORD,
  SET_TMP_EDIT_RECORD,
  SET_TMP_EDIT_RECORD_BY_KEY_VALUE,
} from '../actions/editRecord';

import { convertForView } from '../utils/RecordUtil';

type State = { id?: string };

const initialState: State = {};

export default function editRecordReducer(state = initialState, action): State {
  switch (action.type) {
    case INITIALIZE:
      return initialState;
    case SET_EDIT_RECORD:
    case SET_TMP_EDIT_RECORD:
      return convertForView(action.payload);
    case SET_TMP_EDIT_RECORD_BY_KEY_VALUE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
}
