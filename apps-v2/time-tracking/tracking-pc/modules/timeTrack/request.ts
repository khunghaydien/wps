import * as constants from '../../constants';

type State = { id: string };

const initialState: State = {
  id: '',
};

// Actions
const ActionType = {
  TIME_TRACK_MONTHLY_CLEAR: constants.TIME_TRACK_MONTHLY_CLEAR,
  TIME_TRACK_MONTHLY_SET_REQUEST: constants.TIME_TRACK_MONTHLY_SET_REQUEST,
} as const;

type TimeTrackMonthlyClearAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_CLEAR;
};

type TimeTrackMonthlySetRequestAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_SET_REQUEST;
  payload: string;
};

type Action = TimeTrackMonthlyClearAction | TimeTrackMonthlySetRequestAction;

export const set = (id: string): TimeTrackMonthlySetRequestAction => ({
  type: ActionType.TIME_TRACK_MONTHLY_SET_REQUEST,
  payload: id,
});

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.TIME_TRACK_MONTHLY_CLEAR:
      return initialState;

    case ActionType.TIME_TRACK_MONTHLY_SET_REQUEST:
      return {
        id: action.payload,
      };

    default:
      return state;
  }
};
