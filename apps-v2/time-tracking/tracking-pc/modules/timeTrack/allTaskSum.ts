import * as constants from '../../constants';

type State = number;

const initialState: State = 0;

// Actions
const ActionType = {
  TIME_TRACK_MONTHLY_CLEAR: constants.TIME_TRACK_MONTHLY_CLEAR,
  TIME_TRACK_MONTHLY_SET_SUMMARY_SUM_TASK_TIME:
    constants.TIME_TRACK_MONTHLY_SET_SUMMARY_SUM_TASK_TIME,
} as const;

type TimeTrackMonthlyClearAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_CLEAR;
};

type TimeTrackMonthlySetSummarySumTaskTimeAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_SET_SUMMARY_SUM_TASK_TIME;
  payload: number;
};

type Action =
  | TimeTrackMonthlyClearAction
  | TimeTrackMonthlySetSummarySumTaskTimeAction;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case constants.TIME_TRACK_MONTHLY_CLEAR:
      return initialState;

    case constants.TIME_TRACK_MONTHLY_SET_SUMMARY_SUM_TASK_TIME:
      return action.payload;

    default:
      return state;
  }
};
