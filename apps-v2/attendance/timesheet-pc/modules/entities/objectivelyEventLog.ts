import { ObjectivelyEventLog } from '@attendance/domain/models/ObjectivelyEventLog';

import ROOT from './actionType';

export type State = ObjectivelyEventLog[] | null;

const initialState: State = null;

const ACTION_TYPE_ROOT = `${ROOT}/DAILY_OBJECTIVELY_EVENT_LOG_DIALOG` as const;

const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type Set = {
  type: typeof ACTION_TYPE.SET;
  payload: ObjectivelyEventLog[];
};

type Clear = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Action = Set | Clear;

export const set = (records: ObjectivelyEventLog[]): Set => ({
  type: ACTION_TYPE.SET,
  payload: records,
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
