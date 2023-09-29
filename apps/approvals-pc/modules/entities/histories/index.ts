import { ApprovalHistory } from '../../../../domain/models/approval/request/History';

import { constants as requestConstants } from '../../ui/timeTrack/request';

type State = ReadonlyArray<ApprovalHistory>;

const initialState: State = [];

const FETCH_SUCCESS = 'MODULES/ENTITIES/HISTORIES/FETCH_SUCCESS';

type FetchSuccess = {
  type: 'MODULES/ENTITIES/HISTORIES/FETCH_SUCCESS';
  payload: State;
};

export const fetchSuccess = (payload: State): FetchSuccess => ({
  type: FETCH_SUCCESS,
  payload,
});

type Action = FetchSuccess;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.payload;
    case requestConstants.APPROVE_SUCCESS:
    case requestConstants.REJECT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
