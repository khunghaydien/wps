import * as constants from '../../constants';
import {
  LABEL_UNAPPROVED,
  labelMapping,
} from '@commons/constants/requestStatus';

import { MonthlyTrack } from '@apps/domain/models/time-tracking/MonthlyTrack';

type State = Partial<MonthlyTrack['overview']>;

const initialState: State = {};

// Actions
const ActionType = {
  TIME_TRACK_MONTHLY_CLEAR: constants.TIME_TRACK_MONTHLY_CLEAR,
  TIME_TRACK_MONTHLY_SET_OVERVIEW: constants.TIME_TRACK_MONTHLY_SET_OVERVIEW,
} as const;

type TimeTrackMonthlyClearAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_CLEAR;
};

type TimeTrackMonthlySetOverviewAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_SET_OVERVIEW;
  payload: MonthlyTrack['overview'];
};

type Action = TimeTrackMonthlyClearAction | TimeTrackMonthlySetOverviewAction;

export const set = (
  overview: MonthlyTrack['overview']
): TimeTrackMonthlySetOverviewAction => ({
  type: constants.TIME_TRACK_MONTHLY_SET_OVERVIEW,
  payload: overview,
});

export const statusApprovalLabelSelector = (state: {
  timeTrack: { overview: State };
}): string => {
  const key = state.timeTrack.overview?.status
    ? state.timeTrack.overview?.status
    : '';
  return labelMapping[key] ? labelMapping[key] : LABEL_UNAPPROVED;
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.TIME_TRACK_MONTHLY_CLEAR:
      return initialState;

    case ActionType.TIME_TRACK_MONTHLY_SET_OVERVIEW:
      return action.payload;

    default:
      return state;
  }
};
