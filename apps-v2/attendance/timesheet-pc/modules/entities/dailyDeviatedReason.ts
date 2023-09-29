import { DailyObjectivelyEventLogDeviationReasons } from '@attendance/domain/models/DailyObjectivelyEventLogDeviationReason';

import ROOT from './actionType';

export type State = DailyObjectivelyEventLogDeviationReasons | null;

const initialState: State = null;

const ACTION_TYPE_ROOT = `${ROOT}/DAILY_DEVIATED_REASONS` as const;

const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type Set = {
  type: typeof ACTION_TYPE.SET;
  payload: DailyObjectivelyEventLogDeviationReasons;
};

type Clear = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Action = Set | Clear;

export const set = (
  reasons: DailyObjectivelyEventLogDeviationReasons
): Set => ({
  type: ACTION_TYPE.SET,
  payload: reasons,
});

export const clear = (): Clear => ({
  type: ACTION_TYPE.CLEAR,
});

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.SET:
      return action.payload;
    case ACTION_TYPE.CLEAR:
      return initialState;
    default:
      return state;
  }
}
