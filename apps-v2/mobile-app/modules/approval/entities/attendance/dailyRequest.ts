import { AttDailyRequestDetail } from '@attendance/domain/models/approval/AttDailyRequestDetail';

import ROOT from './actionType';

const ACTION_TYPE_ROOT = `${ROOT}/DAILY_REQUEST` as const;

type State = AttDailyRequestDetail | null;

const ACTION_TYPES = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
} as const;

type SetAction = {
  type: typeof ACTION_TYPES.SET;
  payload: State;
};

type Action = SetAction;

export const actions = {
  set: (request: State): SetAction => ({
    type: ACTION_TYPES.SET,
    payload: request,
  }),
};

const initialState = null;

export default (state = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.SET:
      return action.payload;
    default:
      return state;
  }
};
