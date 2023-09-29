import * as constants from '../../../constants';

import { TaskForMonthlyReportSummary } from '@apps/domain/models/time-tracking/Task';

type State = Record<string, TaskForMonthlyReportSummary>;

const initialState: State = {};

// Actions
const ActionType = {
  TIME_TRACK_MONTHLY_CLEAR: constants.TIME_TRACK_MONTHLY_CLEAR,
  TIME_TRACK_MONTHLY_SET_SUMMARY_TASK:
    constants.TIME_TRACK_MONTHLY_SET_SUMMARY_TASK,
} as const;

type TimeTrackMonthlyClearAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_CLEAR;
};

type TimeTrackMonthlySetSummaryTaskAction = {
  type: typeof ActionType.TIME_TRACK_MONTHLY_SET_SUMMARY_TASK;
  payload: { byId: Record<string, TaskForMonthlyReportSummary> };
};

type Action =
  | TimeTrackMonthlyClearAction
  | TimeTrackMonthlySetSummaryTaskAction;

export default (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.TIME_TRACK_MONTHLY_CLEAR:
      return initialState;

    case ActionType.TIME_TRACK_MONTHLY_SET_SUMMARY_TASK:
      return action.payload.byId;

    default:
      return state;
  }
};
