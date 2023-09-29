import defaultSummary, {
  RequestSummary,
} from '../../../../domain/models/time-tracking/RequestSummary';

type State = RequestSummary;

const initialState: State = defaultSummary;

export const FETCH_SUCCESS =
  'TRACK_SUMMARY/ENTITIES/REQUEST_SUMMARY/FETCH_SUCCESS';

export const RESET = 'TRACK_SUMMARY/ENTITIES/REQUEST_SUMMARY/RESET';

type FetchSuccess = {
  type: 'TRACK_SUMMARY/ENTITIES/REQUEST_SUMMARY/FETCH_SUCCESS';
  payload: RequestSummary;
};

type Reset = {
  type: 'TRACK_SUMMARY/ENTITIES/REQUEST_SUMMARY/RESET';
};

export const actions = {
  fetchSuccess: (summary: RequestSummary): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: summary,
  }),
  reset: (): Reset => ({
    type: RESET,
  }),
};

type Action = FetchSuccess | Reset;

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}
