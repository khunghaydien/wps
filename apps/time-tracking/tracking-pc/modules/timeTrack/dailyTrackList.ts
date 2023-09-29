import * as constants from '../../constants';

import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';

type State = DailyTrackList;

const initialState: State = {};

// Actions
const ActionType = {
  TIME_TRACK_MONTHLY_CLEAR: constants.TIME_TRACK_MONTHLY_CLEAR,
  TIME_TRACK_MONTHLY_SET_DAILY_LIST:
    constants.TIME_TRACK_MONTHLY_SET_DAILY_LIST,
} as const;

type TimeTrackMonthlyClearAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_CLEAR;
};

type TimeTrackMonthlySetDailyListAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_SET_DAILY_LIST;
  payload: DailyTrackList;
};

type Action = TimeTrackMonthlyClearAction | TimeTrackMonthlySetDailyListAction;

export const clear = (): TimeTrackMonthlyClearAction => ({
  type: ActionType.TIME_TRACK_MONTHLY_CLEAR,
});

export const set = (
  dailyList: DailyTrackList
): TimeTrackMonthlySetDailyListAction => ({
  type: ActionType.TIME_TRACK_MONTHLY_SET_DAILY_LIST,
  payload: dailyList,
});

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.TIME_TRACK_MONTHLY_CLEAR:
      return initialState;

    case ActionType.TIME_TRACK_MONTHLY_SET_DAILY_LIST:
      return action.payload;

    default:
      return state;
  }
};
