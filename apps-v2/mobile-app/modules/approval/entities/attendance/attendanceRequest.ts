import { FixMonthlyRequest } from '@attendance/domain/models/approval/FixMonthlyRequest';

import ROOT from './actionType';

const ACTION_TYPE_ROOT = `${ROOT}/ATTENDANCE_REQUEST` as const;

type State = FixMonthlyRequest | null;

const ACTION_TYPES = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type SetAction = {
  type: typeof ACTION_TYPES.SET;
  payload: State;
};

type ClearAction = {
  type: typeof ACTION_TYPES.CLEAR;
};

type Action = SetAction | ClearAction;

export const actions = {
  set: (request: State): SetAction => ({
    type: ACTION_TYPES.SET,
    payload: request,
  }),
  clear: (): ClearAction => ({ type: ACTION_TYPES.CLEAR }),
};

const initialState = null;

export default (state = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.SET:
      return action.payload;
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
