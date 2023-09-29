import { ShortTimeWorkReason } from '../models/short-time-work-reason/ShortTimeWorkReason';

import { SEARCH_SHORT_TIME_WORK_REASON } from '../actions/shortTimeWorkReason';

type State = ShortTimeWorkReason[];

const initialState: State = [];

type Action = {
  type: string;
  payload: State;
};

export default function searchShortTimeWorkReasonReducer(
  state: State = initialState,
  action: Action
) {
  switch (action.type) {
    case SEARCH_SHORT_TIME_WORK_REASON:
      return action.payload;
    default:
      return state;
  }
}
