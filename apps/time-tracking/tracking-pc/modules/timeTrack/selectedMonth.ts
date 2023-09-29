import * as constants from '../../constants';

type State = string;

const initialState: State = '';

// Actions
const ActionType = {
  TIME_TRACK_MONTHLY_SELECT_MONTH: constants.TIME_TRACK_MONTHLY_SELECT_MONTH,
} as const;

type TimeTrackMonthlySelectMonthAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_SELECT_MONTH;
  payload: string;
};

type Action = TimeTrackMonthlySelectMonthAction;

export const set = (
  selectedMonth: string
): TimeTrackMonthlySelectMonthAction => ({
  type: ActionType.TIME_TRACK_MONTHLY_SELECT_MONTH,
  payload: selectedMonth,
});

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.TIME_TRACK_MONTHLY_SELECT_MONTH:
      return action.payload;

    default:
      return state;
  }
};
