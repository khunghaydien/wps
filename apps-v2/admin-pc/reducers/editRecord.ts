import { INITIALIZE, SET_EDIT_RECORD } from '../actions/editRecord';

import { convertForView } from '../utils/RecordUtil';

type State = { id?: string };
const initialState: State = {};

export default function editRecordReducer(state = initialState, action): State {
  switch (action.type) {
    case INITIALIZE:
      return initialState;
    case SET_EDIT_RECORD:
      return convertForView(action.payload);
    default:
      return state;
  }
}
